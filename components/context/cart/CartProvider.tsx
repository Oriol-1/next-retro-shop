import { FC, ReactNode, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';


import { ICartProduct, IOrder, ShippingAddress, } from '../../interfaces';
import { CartContext, cartReducer } from './';
import { tesloApi } from '@/api';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;

    shippingAddress?: ShippingAddress;
}

// export interface ShippingAddress {
//     firstName: string;
//     lastName : string;
//     email : string;
//     phone    : string;
//     address  : string;
//     zip      : string;
// }

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined
}
interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: FC<CartProviderProps> = ({ children }) => {

    const [state, dispatch] = useReducer( cartReducer , CART_INITIAL_STATE );

    // Efecto
    useEffect(() => {
        try {
            const cookieProducts = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ): []
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cookieProducts });
        } catch (error) {
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: [] });
        }
    }, []);


    
    useEffect(() => {

        if ( Cookie.get('firstName')){
            const shippingAddress = {
                firstName : Cookie.get('firstName') || '',
                lastName  : Cookie.get('lastName') || '',
                email  : Cookie.get('email') || '',
                phone     : Cookie.get('phone') || '',
                address   : Cookie.get('address') || '',
                zip       : Cookie.get('zip') || '',
            }
            
            dispatch({ type:'[Cart] - LoadAddress from Cookies', payload: shippingAddress })
        }
    }, [])

    
    useEffect(() => {
        if (state.cart.length > 0){
        Cookie.set('cart', JSON.stringify( state.cart ));
        }
      }, [state.cart]);
  
  
    //   useEffect(() => {
    //     Cookie.set('cart', JSON.stringify( state.cart ));
    //   }, [state.cart]);
  

      useEffect(() => {
          
          const numberOfItems = state.cart.reduce( ( prev, current ) => current.quantity + prev , 0 );
          const subTotal = state.cart.reduce( ( prev, current ) => (current.price * current.quantity) + prev, 0 );
          const taxRate =  Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
      
          const orderSummary = {
              numberOfItems,
              subTotal,
              tax: subTotal * taxRate,
              total: subTotal * ( taxRate + 1 )
          }
  
          dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });
      }, [state.cart]);
  
  
  
      const addProductToCart = ( product: ICartProduct ) => {
       
          const productInCart = state.cart.some( p => p._id === product._id );
          if ( !productInCart ) return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product ] })
  
          const productInCartButDifferentSize = state.cart.some( p => p._id === product._id && p.size === product.size );
          if ( !productInCartButDifferentSize ) return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product ] })
  
          // Acumular
          const updatedProducts = state.cart.map( p => {
              if ( p._id !== product._id ) return p;
              if ( p.size !== product.size ) return p;
  
              // Actualizar la cantidad
              p.quantity += product.quantity;
              return p;
          });
  
          dispatch({ type: '[Cart] - Update products in cart', payload: updatedProducts });
  
      }
  
      const updateCartQuantity = ( product: ICartProduct ) => {
          dispatch({ type: '[Cart] - Change cart quantity', payload: product });
      }
  
      const removeCartProduct = ( product: ICartProduct ) => {
          dispatch({ type: '[Cart] - Remove product in cart', payload: product });
      }
    const updateAddress = ( address: ShippingAddress ) => {
        Cookie.set('firstName',address.firstName);
        Cookie.set('lastName',address.lastName);
        Cookie.set('email',address.email);
        Cookie.set('phone',address.phone);
        Cookie.set('address',address.address);
        Cookie.set('zip',address.zip);

        dispatch({ type: '[Cart] - Update Address', payload: address });

    }


    const createOrder = async():Promise<{ hasError: boolean; message: string; }> => {

        if ( !state.shippingAddress ) {
            throw new Error('No hay dirección de entrega');
        }

        const body: IOrder = {
            orderItems: state.cart.map( p => ({
                ...p,
                size: p.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            tax: state.tax,
            total: state.total,
            isPaid: false
        }


        try {
            
            const { data } = await tesloApi.post<IOrder>('/orders/',body)
       


            dispatch({ type: '[Cart] - Order complete' });

            return {
                hasError: false,
                message: data._id!
            }


        } catch (error) {
            if ( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }
            return {
                hasError: true,
                message : 'Error no controlado, hable con el administrador'
            }
        }

    }



    return (
        <CartContext.Provider value={{
            ...state,

            // Methods
            addProductToCart,
            removeCartProduct,
            updateCartQuantity,
            updateAddress,

            // Orders
            createOrder,
        }}>
            { children }
        </CartContext.Provider>
    )
};