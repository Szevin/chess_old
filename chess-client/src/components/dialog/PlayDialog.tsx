import {
  useToast, Input, Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Divider, HStack, FormControl, FormLabel, Select,
} from '@chakra-ui/react'
import { GameType, Rule } from 'chess-common/lib/Board'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useCreateBoardMutation } from '../../store/rest/board'
import { useSocket } from '../../store/socket'

const PlayDialog = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const navigate = useNavigate()
  const toast = useToast()
  const [createBoard] = useCreateBoardMutation()
  const { join } = useSocket()

  const form = useForm({
    defaultValues: {
      type: 'normal' as GameType,
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    },
  })

  const handleSubmit = async () => {
    const { fen, type } = form.getValues()
    const allRules = [Rule.FOG_OF_WAR, Rule.NO_CAPTURE, Rule.NO_PAWNS, Rule.NO_RETREAT, Rule.RENDER_SWAP]
    const firstRandomRuleIndex = Math.floor(Math.random() * allRules.length)
    const secondRandomRuleIndex = Math.floor(Math.random() * allRules.length)
    const res = await createBoard({
      FEN: ['normal', 'adaptive'].includes(type) ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR' : fen,
      type,
      rules: [allRules[firstRandomRuleIndex], allRules[secondRandomRuleIndex]],
    })

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
            <FormControl>
              <FormLabel htmlFor="type">Type</FormLabel>
              <Select
                autoFocus
                width="97%"
                id="type"
                defaultValue="normal"
                {...form.register('type')}
              >
                <option value="normal">normal</option>
                <option value="adaptive">adaptive</option>
                <option value="custom">custom</option>
              </Select>
            </FormControl>

            <FormControl hidden={['normal', 'adaptive'].includes(form.watch('type'))}>
              <FormLabel htmlFor="fen">FEN</FormLabel>
              <Input
                width="97%"
                id="fen"
                defaultValue="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
                {...form.register('fen')}
              />
            </FormControl>

            <HStack verticalAlign="center" justifyContent="center" marginTop={4}>
              <Button width="100%" colorScheme="green" onClick={handleSubmit}>Create</Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}

export default PlayDialog
