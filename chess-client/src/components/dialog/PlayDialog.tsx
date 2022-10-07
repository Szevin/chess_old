import {
  useToast, Input, Button, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogHeader, AlertDialogOverlay, HStack, Divider,
} from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router'

const PlayDialog = ({ isOpen, leastDestructiveRef, onClose }: { isOpen: boolean, leastDestructiveRef: any, onClose: () => void }) => {
  const navigate = useNavigate()
  const toast = useToast()
  const [id, setId] = React.useState<string>()

  const handleJoin = () => {
    if (!isIdValid()) {
      toast({
        title: 'Invalid ID',
        description: 'Please enter a valid ID',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    navigate(`/board/${id}`)
  }

  const isIdValid = () => id && Number.isInteger(Number(id))

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={leastDestructiveRef}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Play
            <Divider />
          </AlertDialogHeader>
          <AlertDialogBody>
            <Input autoFocus onChange={(e) => setId(e.target.value)} onKeyDown={(e) => (e.key === 'Enter' ? handleJoin() : null)} />

            <HStack verticalAlign="center" justifyContent="center" marginTop={4}>
              <Button width="100%" onClick={handleJoin} colorScheme="blue" disabled={!isIdValid()}>Join</Button>
              <Button width="100%" colorScheme="green">Create</Button>
            </HStack>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default PlayDialog
