import { Grid, GridItem } from '@chakra-ui/react'
import React from 'react'
import { Outlet } from 'react-router'
import Footer from './Footer'
import Header from './Header'

const Layout = () => (
  <Grid height="100vh" templateRows="(repeat(3, 1fr))">
    <GridItem gridRow={1}>
      <Header />
    </GridItem>
    <GridItem gridRow={2} marginY={20}>
      <Outlet />
    </GridItem>
    <GridItem gridRow={3}>
      <Footer />
    </GridItem>
  </Grid>
)

export default Layout
