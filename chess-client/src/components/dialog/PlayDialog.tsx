import {
  useToast, Input, Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Divider, HStack, FormControl, FormLabel, Select, Checkbox,
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
      name: '',
      type: 'normal' as GameType,
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
      time: -1,
      isPublic: true,
    },
  })

  const isValidFEN = (fen: string) => {
    const fenParts = fen.split('/')
    if (fenParts.length !== 8) return false
    if (fen.includes(' ')) return false
    if (fen.indexOf('K') === -1 || fen.indexOf('k') === -1) return false
    if (fen.indexOf('K') !== fen.lastIndexOf('K')) return false
    if (fen.indexOf('k') !== fen.lastIndexOf('k')) return false
    if (fenParts.some((part) => part.length > 8)) return false
    if (fenParts.some((part) => part.split('').map((s) => (Number(s) ? Number(s) : 1)).reduce((sum, i) => sum + i, 0) < 7)) return false

    return true
  }

  const handleSubmit = async () => {
    const { name, fen, type, time, isPublic } = form.getValues()
    if (!isValidFEN(fen)) {
      toast({
        title: 'Error',
        description: t('playdialog.fen.invalid'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const allRules = [Rule.FOG_OF_WAR, Rule.NO_CAPTURE, Rule.NO_PAWNS, Rule.NO_RETREAT, Rule.RENDER_SWAP]
    const firstRandomRuleIndex = Math.floor(Math.random() * allRules.length)
    const secondRandomRuleIndex = Math.floor(Math.random() * allRules.length)
    const res = await createBoard({
      pieces: ['normal', 'adaptive'].includes(type) ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR' : fen.trim(),
      type,
      time,
      rules: type !== 'normal' ? [allRules[firstRandomRuleIndex], allRules[secondRandomRuleIndex]] : [],
      name,
      isPublic,
    })

    if (!('data' in res)) {
      toast({
        title: 'Error',
        description: (res.error as { data: string }).data,
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
            <FormControl id="name">
              <FormLabel>{t('playdialog.name')}</FormLabel>
              <Input {...form.register('name')} />
            </FormControl>

            <FormControl id="isPublic" mt={2}>
              <HStack>
                <FormLabel>{t('playdialog.public')}</FormLabel>
                <Checkbox {...form.register('isPublic')} />
              </HStack>
            </FormControl>

            <FormControl id="type" mt={2}>
              <FormLabel>{t('game.type')}</FormLabel>
              <Select
                width="97%"
                defaultValue="normal"
                {...form.register('type')}
              >
                <option value="normal">{t('game.type.normal')}</option>
                <option value="adaptive">{t('game.type.adaptive')}</option>
                <option value="custom">{t('game.type.custom')}</option>
              </Select>
            </FormControl>

            <FormControl id="time" mt={2}>
              <FormLabel>{t('playdialog.time')}</FormLabel>
              <Select
                width="97%"
                defaultValue="-1"
                {...form.register('time')}
              >
                <option value="-1">{t('playdialog.time.unlimited')}</option>
                <option value="60">1 {t('playdialog.time.minute')}</option>
                <option value="300">5 {t('playdialog.time.minute')}</option>
                <option value="600">10 {t('playdialog.time.minute')}</option>
                <option value="900">15 {t('playdialog.time.minute')}</option>
                <option value="1800">30 {t('playdialog.time.minute')}</option>
              </Select>
            </FormControl>

            <FormControl id="fen" mt={2} hidden={['normal', 'adaptive'].includes(form.watch('type'))}>
              <FormLabel>{t('playdialog.fen')}</FormLabel>
              <Input
                width="97%"
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
