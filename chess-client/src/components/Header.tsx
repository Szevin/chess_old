import { Heading, Box, Button } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router'
import { useAppSelector } from '../store'

const Header = () => {
  const user = useAppSelector((state) => state.user)
  const navigate = useNavigate()

  return (
    <Box
      as="header"
      width="100%"
      height="64px"
      backgroundColor="#F7BB38"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Heading as="h1" size="xl">
        Adaptive Chess
      </Heading>
      <Button onClick={() => navigate('/login')}>Login</Button>
      <Button onClick={() => navigate('/register')}>Register</Button>
      <span>{user._id}</span>
    </Box>
  )
}

export default Header
