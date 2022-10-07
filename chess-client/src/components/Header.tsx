import { Heading, Box } from '@chakra-ui/react'
import React from 'react'

const Header = () => (
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
  </Box>
)

export default Header
