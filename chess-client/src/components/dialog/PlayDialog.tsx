import {
  useToast, Input, Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Divider, HStack, FormControl, FormLabel, Select,
} from '@chakra-ui/react'
import { GameType, Rule } from 'chess-common/lib/Board'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import useTranslate from '../../hooks/useTranslate'
import { useCreateBoardMutation } from '../../store/rest/board'
import { useSocket } from '../../store/socket'

const PlayDialog = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const navigate = useNavigate()
  const toast = useToast()
  const [createBoard] = useCreateBoardMutation()
  const { join } = useSocket()
  const t = useTranslate()

  const form = useForm({
    defaultValues: {
      type: 'normal' as GameType,
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
      time: -1,
    },
  })

  const handleSubmit = async () => {
    const { fen, type, time } = form.getValues()
    const allRules = [Rule.FOG_OF_WAR, Rule.NO_CAPTURE, Rule.NO_PAWNS, Rule.NO_RETREAT, Rule.RENDER_SWAP]
    const firstRandomRuleIndex = Math.floor(Math.random() * allRules.length)
    const secondRandomRuleIndex = Math.floor(Math.random() * allRules.length)
    const res = await createBoard({
      FEN: ['normal', 'adaptive'].includes(type) ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR' : fen,
      type,
      time,
      rules: type !== 'normal' ? [allRules[firstRandomRuleIndex], allRules[secondRandomRuleIndex]] : [],
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
            {t('playdialog.title')}
            <Divider />
          </ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel htmlFor="type">{t('game.type')}</FormLabel>
              <Select
                autoFocus
                width="97%"
                id="type"
                defaultValue="normal"
                {...form.register('type')}
              >
                <option value="normal">{t('game.type.normal')}</option>
                <option value="adaptive">{t('game.type.adaptive')}</option>
                <option value="custom">{t('game.type.custom')}</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="time">{t('playdialog.time')}</FormLabel>
              <Select
                width="97%"
                id="time"
                defaultValue="-1"
                {...form.register('time')}
              >
                <option value="-1">{t('playdialog.time.unlimited')}</option>
                <option value="60">1 {t('playdialog.time.minute')}</option>
                <option value="300">5 {t('playdialog.time.minute')}</option>
                <option value="600">10 {t('playdialog.time.minute')}</option>
                <option value="900">15 {t('playdialog.time.minute')}</option>
                <option value="1800">30 {t('playdialog.time.minutes')}</option>
              </Select>
            </FormControl>

            <FormControl hidden={['normal', 'adaptive'].includes(form.watch('type'))}>
              <FormLabel htmlFor="fen">{t('playdialog.fen')}</FormLabel>
              <Input
                width="97%"
                id="fen"
                defaultValue="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
                {...form.register('fen')}
              />
            </FormControl>

            <HStack verticalAlign="center" justifyContent="center" marginTop={4}>
              <Button width="100%" colorScheme="green" onClick={handleSubmit}>{t('playdialog.create')}</Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}

export default PlayDialog
