import { ShopLayout } from '../../components/layouts'
import { Box, Typography, Link as MuiLink } from '@mui/material'
import { RemoveShoppingCartOutlined } from '@mui/icons-material'
import Link from 'next/link';
import NextLink from 'next/link';

const EmptyPage = () => (
  <ShopLayout title="Carrito vació" pageDescription="No hay artículos en el carrito de compras">
         <Box 
            display='flex' 
            justifyContent='center' 
            alignItems='center' 
            height='calc(100vh - 200px)'
            sx={{ flexDirection: { xs: 'column', sm: 'row' }}}
        >
            <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
            <Box display='flex' flexDirection='column' alignItems='center'>
                <Typography>Su carrito está vació</Typography>
                <NextLink href='/' passHref>
                  
                    Regresar
             
                </NextLink>
               
            </Box>


        </Box>
    </ShopLayout>
)

export default EmptyPage
