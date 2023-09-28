import { IOrder } from "@/components/interfaces";
import { ShopLayout } from "@/components/layouts"
import { dbOrders } from "@/database";
import { Button, Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import NextLink from 'next/link';



const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: 'Nombre Completo', width: 300 },

    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra información si está pagada la orden o no',
        width: 200,
        renderCell: (params: GridRenderCellParams) => { if(params.value === true){
            return (
                <Chip color="success" label="Pagada" variant='outlined' />
            )
        }
        else{
            return (
                <Chip color="error" label="No pagada" variant='outlined' />
            )
        }
            

        }
    },
    {
        field: 'orden',
        headerName: 'Ver orden',
        width: 200,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
            <NextLink href={`/orders/${ params.row.orderId }`} passHref>
                <Button 
                    variant='outlined' 
                    role="button"
                    sx={{ 
                        textDecoration: 'none',
                        color: 'black',
                        '&:hover': {
                            color: 'red',
                            textDecoration: 'none',
                        },
                        '&:active': {
                            textDecoration: 'none',
                        }
                    }}
                >
                    Ver orden
                </Button>
            </NextLink>
        )
       
    }
];


interface Props {
    orders: IOrder[]
}

const HistoryPage: NextPage<Props> = ({ orders }) => {

    // const rows = ..  
    // { id: indice + 1, paid: true, fullname: 'Fernando Herrera', orderId: 1283781237123 }
    const rows = orders.map( (order, idx) => ({
        id: idx + 1,
        paid: order.isPaid,
        fullname: `${ order.shippingAddress.firstName } ${ order.shippingAddress.lastName }`,
        orderId: order._id
    }))

  return (
    <ShopLayout title={'Historial de ordenes'} pageDescription={'Historial de ordenes del cliente'}>
        <Typography variant='h1' component='h1'>Historial de ordenes</Typography>


        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height:650, width: '100%' }}>
                <DataGrid 
    rows={ rows }
    columns={ columns }
    pagination={true}
  
/>

            </Grid>
        </Grid>

    </ShopLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    
    const session: any = await getSession({ req });

    if ( !session ) {
        return {
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false,
            }
        }
    }

    const orders = await dbOrders.getOrdersByUser( session.user._id );


    return {
        props: {
            orders
        }
    }
}



export default HistoryPage