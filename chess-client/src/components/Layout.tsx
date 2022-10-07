import { Grid } from '@chakra-ui/react'
import React from 'react'
import { Outlet } from 'react-router'
import Footer from './Footer'
import Header from './Header'

const Layout = () => (
  <>
    <Header />
    <Grid marginTop={10}>
      <Outlet />
    </Grid>
    <Footer />
  </>
)

export default Layout
