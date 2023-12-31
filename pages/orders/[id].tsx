import CarList from "@/components/cart/CarList"
import { GetServerSideProps, NextPage } from "next";
import OrderSummary from "@/components/cart/OrderSummary"
import { ShopLayout } from "@/components/layouts"
import { CreditCardOffOutlined, CreditScoreOutlined, CreditScoreRounded } from "@mui/icons-material";
import { Link, Box, Button, Card, CardContent, Divider, Grid, Typography, Chip } from "@mui/material"
import NextLink from 'next/link';
import { IOrder } from "@/components/interfaces";
import { getSession } from "next-auth/react";
import { dbOrders } from "@/database";


interface Props {
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {


    const { shippingAddress } = order;


  return (
    <ShopLayout title='Resumen de la orden' pageDescription={'Resumen de la orden'}>
        <Typography variant='h1' component='h1'>Orden: { order._id }</Typography>

        {
            order.isPaid
            ? (
                <Chip 
                    sx={{ my: 2 }}
                    label="Orden ya fue pagada"
                    variant='outlined'
                    color="success"
                    icon={ <CreditScoreOutlined /> }
                />
            ):
            (
                <Chip 
                    sx={{ my: 2 }}
                    label="Pendiente de pago"
                    variant='outlined'
                    color="error"
                    icon={ <CreditCardOffOutlined /> }
                />
            )
        }

        

        <Grid container className='fadeIn'>
            <Grid item xs={ 12 } sm={ 7 }>
                <CarList products={  order.orderItems } />
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen ({ order.numberOfItems } { order.numberOfItems > 1 ? 'productos': 'producto'})</Typography>
                        <Divider sx={{ my:1 }} />

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Dirección de entrega</Typography>
                        </Box>

                        
                        <Typography>{ shippingAddress.firstName } { shippingAddress.lastName }</Typography>
                        <Typography>{ shippingAddress.address }</Typography>
                        <Typography>{ shippingAddress.email }</Typography>
                        <Typography>{ shippingAddress.phone }</Typography>
                        <Typography> { shippingAddress.zip }</Typography>

                        <Divider sx={{ my:1 }} />


                        <OrderSummary 
                            orderValues={{
                                numberOfItems: order.numberOfItems,
                                subTotal: order.subTotal,
                                total: order.total,
                                tax: order.tax,
                            }} 
                        />

                        <Box sx={{ mt: 3 }} display="flex" flexDirection='column'>
                            {/* TODO */}
                            {
                                order.isPaid
                                ? (
                                    <Chip 
                                        sx={{ my: 2 }}
                                        label="Orden ya fue pagada"
                                        variant='outlined'
                                        color="success"
                                        icon={ <CreditScoreOutlined /> }
                                    />

                                ):(
                                    <h1>Pagar</h1>
                                )
                            }

                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>


    </ShopLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    
    const { id = '' } = query;
    const session:any = await getSession({ req });

    if ( !session ) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${ id }`,
                permanent: false,
            }
        }
    }

    const order = await dbOrders.getOrderById( id.toString() );

    if ( !order ) {
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false,
            }
        }
    }

    if ( order.user !== session.user._id ) {
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false,
            }
        }
    }


    return {
        props: {
            order
        }
    }
}


export default OrderPage;