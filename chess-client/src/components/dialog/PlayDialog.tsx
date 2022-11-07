import {
  useToast, Input, Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Divider, HStack,
} from '@chakra-ui/react'
import { GameType } from 'chess-common'
import { Rule } from 'chess-common/lib/Board'
import React from 'react'
import { useNavigate } from 'react-router'
import { useAppSelector } from '../../store'
import { useCreateBoardMutation } from '../../store/rest/board'
import { useSocket } from '../../store/socket'

const PlayDialog = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const navigate = useNavigate()
  const toast = useToast()
  const [id, setId] = React.useState<string>()
  const [createBoard] = useCreateBoardMutation()
  const { join } = useSocket()
  const user = useAppSelector((state) => state.user)

  const handleJoin = () => {
    if (!id) {
      toast({
        title: 'Invalid ID',
        description: 'Please enter a valid ID',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    join(id)

    navigate(`/board/${id}`)
  }

  const handleCreate = async (FEN: string, type: GameType, rules: Rule[]) => {
    const res = await createBoard({ FEN, type, rules })

    if (!('data' in res)) {
      toast({
        title: 'Error',
        description: 'An error occured while creating the board',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    join(res.data)

    navigate(`/board/${res.data}`)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader fontSize="lg" fontWeight="bold">
            Play
            <Divider />
          </ModalHeader>
          <ModalBody>
            <Input autoFocus onChange={(e) => setId(e.target.value)} onKeyDown={(e) => (e.key === 'Enter' ? handleJoin() : null)} />

            <HStack verticalAlign="center" justifyContent="center" marginTop={4}>
              <Button width="100%" onClick={handleJoin} colorScheme="blue" disabled={!id}>Join</Button>
              <Button width="100%" colorScheme="green" onClick={() => handleCreate('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', 'custom', [Rule.RENDER_SWAP, Rule.NO_PAWNS])}>Create</Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}

export default PlayDialog
