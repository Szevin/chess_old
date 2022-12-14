import {
  Box, Button, HStack, Input, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, useDisclosure, useToast,
} from '@chakra-ui/react'
import { IUser } from 'chess-common'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import PlayDialog from '../components/dialog/PlayDialog'
import useTranslate from '../hooks/useTranslate'
import { useAppSelector } from '../store'
import { useGetAllBoardsQuery } from '../store/rest/board'
import { useSocket } from '../store/socket'

const Main = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const { join } = useSocket()

  const [id, setId] = React.useState<string>()
  const toast = useToast()
  const user = useAppSelector((state) => state.user)
  const { data: boards, refetch: refetchBoards } = useGetAllBoardsQuery()
  const t = useTranslate()

  useEffect(() => {
    const autoFetch = setInterval(() => {
      refetchBoards()
    }, 10_000)
    return () => clearInterval(autoFetch)
  }, [])

  const handleJoinOngoing = () => {
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

  const handleJoin = (id: string) => {
    join(id)
    navigate(`/board/${id}`)
  }

  return (
    <Box width="920px" margin="auto">
      <Input placeholder="ID" autoFocus={!!user._id} disabled={!user._id} onChange={(e) => setId(e.target.value)} onKeyDown={(e) => (e.key === 'Enter' ? handleJoinOngoing() : null)} />
      <HStack>
        <Button width="100%" onClick={handleJoinOngoing} colorScheme="blue" disabled={!id}>{t('main.join')}</Button>
        <Button autoFocus onClick={onOpen} colorScheme="green" width="100%" marginBottom="2rem" disabled={!user._id}>{t('main.play')}</Button>
      </HStack>
      <PlayDialog isOpen={isOpen} onClose={onClose} />

      <TableContainer>
        <Table>
          <TableCaption>{t('main.ongoing')}</TableCaption>
          <Thead>
            <Tr>
              <Th>{t('game.name')}</Th>
              <Th>{t('game.type')}</Th>
              <Th>{t('game.white')}</Th>
              <Th>{t('game.black')}</Th>
              <Th>{t('game.views')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {boards && (user._id ? boards : boards.filter((board) => board.status !== 'waiting')).map((board) => (
              <Tr key={board._id} backgroundColor={user._id && board.status === 'waiting' ? 'teal.400' : 'telegram.400'}>
                <Td>{board.name}</Td>
                <Td>{board.type}</Td>
                <Td>{(board.white as IUser)?.name}</Td>
                <Td>{(board.black as IUser)?.name}</Td>
                <Td>{board.spectators.length}</Td>
                <Td>
                  <Button onClick={() => handleJoin(board._id)}>
                    { [board.black?._id, board.white?._id].includes(user._id) ? t('main.reconnect') : user._id && board.status === 'waiting' ? t('main.join') : t('main.watch') }
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot />
        </Table>
      </TableContainer>

    </Box>
  )
}

export default Main
