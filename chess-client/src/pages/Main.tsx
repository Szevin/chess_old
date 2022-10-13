import {
  Box, Button, Stack, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, useDisclosure,
} from '@chakra-ui/react'
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
  const { data: boards } = useGetAllBoardsQuery()

  const handleJoin = (id: string) => {
    join(id)
    navigate(`/board/${id}`)
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
              <Th>ID</Th>
              <Th>White</Th>
              <Th>Black</Th>
            </Tr>
          </Thead>
          <Tbody>
            {boards && (user._id ? boards : boards.filter((board) => board.status !== 'waiting')).map((board) => (
              <Tr key={board.id} backgroundColor={user._id && board.status === 'waiting' ? 'teal.400' : 'telegram.400'}>
                <Td>{board.id}</Td>
                <Td>{board.white}</Td>
                <Td>{board.black}</Td>
                <Td><Button onClick={() => handleJoin(board.id)}>{ user._id && board.status === 'waiting' ? 'Join' : 'Watch' }</Button></Td>
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
