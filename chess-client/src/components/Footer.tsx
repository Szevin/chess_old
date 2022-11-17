import { Box, Text, useColorMode } from '@chakra-ui/react'
import React from 'react'

const Footer = () => {
  const { colorMode } = useColorMode()

  return (
    <Box
      width="100%"
      height="36px"
      backgroundColor={colorMode === 'light' ? 'gray.200' : 'gray.900'}
      color="blueviolet"
      display="flex"
      alignItems="center"
      justifyContent="center"
      className="footer fixed-bottom"
    >
      <Text>
        Geiger Kevin FOT0IZ 2022
      </Text>
    </Box>
  )
}

export default Footer
