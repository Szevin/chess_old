import { Button, Stack, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import PlayDialog from '../components/dialog/PlayDialog'
import { useAppSelector } from '../store'

const Main = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const user = useAppSelector((state) => state.user)

  if (!user._id) {
    return null
  }

  return (
    <Stack justifyContent="center" alignItems="center">
      <Button autoFocus onClick={onOpen} colorScheme="green">Play</Button>
      <PlayDialog isOpen={isOpen} onClose={onClose} />
    </Stack>
  )
}

export default Main
