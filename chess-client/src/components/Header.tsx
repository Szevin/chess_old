import {
  Heading, Button, GridItem, Grid, Text,
} from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router'
import { useAppSelector } from '../store'

const Header = () => {
  const user = useAppSelector((state) => state.user)
  const navigate = useNavigate()

  return (
    <Grid
      as="header"
      width="100%"
      height="64px"
      backgroundColor="#F7BB38"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      templateColumns="repeat(12, 1fr)"
    >
      <GridItem gridColumn={10}>
        <Heading color="blueviolet" as="h1" size="xl" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Adaptive Chess
        </Heading>
      </GridItem>
      <GridItem gridColumn={1} hidden={!!user._id}>
        <Button color="blueviolet" variant="ghost" onClick={() => navigate('/login')}>Login</Button>
        <Button color="blueviolet" variant="ghost" onClick={() => navigate('/register')}>Register</Button>
      </GridItem>
      <Text gridColumn={1}>{user._id}</Text>
    </Grid>
  )
}

export default Header
