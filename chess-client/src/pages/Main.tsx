import { Button, Stack, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import PlayDialog from '../components/dialog/PlayDialog'

const Main = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Stack justifyContent="center" alignItems="center">
      <Button onClick={onOpen} colorScheme="green">Play</Button>
      <PlayDialog isOpen={isOpen} onClose={onClose} />
    </Stack>
  )
}

export default Main
