import {
  Box, Button, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, useDisclosure,
} from '@chakra-ui/react'
import { IUser } from 'chess-common'
import React from 'react'
import { useNavigate } from 'react-router'
import PlayDialog from '../components/dialog/PlayDialog'
import { useAppSelector } from '../store'
import { useGetAllBoardsQuery } from '../store/rest/board'
import { useSocket } from '../store/socket'

const Main = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const { join } = useSocket()

  const user = useAppSelector((state) => state.user)
  const { data: boards, refetch: refetchBoards } = useGetAllBoardsQuery()

  const autoFetch = setInterval(() => {
    refetchBoards()
  }, 5_000)

  const handleJoin = (id: string) => {
    join(id)
    navigate(`/board/${id}`)
    clearInterval(autoFetch)
  }

  return (
    <Box width="920px" margin="auto">
      <Button autoFocus onClick={onOpen} colorScheme="green" width="100%" marginBottom="2rem" disabled={!user._id}>Play</Button>
      <PlayDialog isOpen={isOpen} onClose={onClose} />

      <TableContainer>
        <Table>
          <TableCaption>Ongoing games</TableCaption>
          <Thead>
            <Tr>
              <Th>Type</Th>
              <Th>White</Th>
              <Th>Black</Th>
              <Th>Views</Th>
            </Tr>
          </Thead>
          <Tbody>
            {boards && (user._id ? boards : boards.filter((board) => board.status !== 'waiting')).map((board) => (
              <Tr key={board._id} backgroundColor={user._id && board.status === 'waiting' ? 'teal.400' : 'telegram.400'}>
                <Td>{board.type}</Td>
                <Td>{(board.white as IUser)?.name}</Td>
                <Td>{(board.black as IUser)?.name}</Td>
                <Td>{board.spectators.length}</Td>
                <Td>
                  <Button onClick={() => handleJoin(board._id)}>
                    { [board.black?._id, board.white?._id].includes(user._id) ? 'Reconnect' : user._id && board.status === 'waiting' ? 'Join' : 'Watch' }
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
