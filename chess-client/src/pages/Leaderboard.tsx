import {
  TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot,
} from '@chakra-ui/react'
import { IUser } from 'chess-common'
import React from 'react'
import { useGetAllUsersQuery } from '../store/rest/user'

const Leaderboard = () => {
  const [sortBy, setSortBy] = React.useState<keyof IUser>('elo')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')
  const { data: users } = useGetAllUsersQuery()
  const sortedUsers = React.useMemo(() => {
    if (!users) return []
    return [...users].sort((a, b) => {
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1
      return 0
    })
  }, [users, sortBy, sortOrder])

  const sort = (key: keyof IUser) => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortOrder('desc')
    }
  }

  return (
    <TableContainer>
      <Table variant="striped" colorScheme="teal">
        <TableCaption>Leaderboard</TableCaption>
        <Thead>
          <Tr>
            <Th cursor="pointer" onClick={() => sort('name')}>Name</Th>
            <Th cursor="pointer" onClick={() => sort('elo')}>Elo</Th>
            <Th cursor="pointer" onClick={() => sort('wins')}>Wins</Th>
            <Th cursor="pointer" onClick={() => sort('losses')}>Losses</Th>
            <Th cursor="pointer" onClick={() => sort('draws')}>Draws</Th>
            <Th cursor="pointer" onClick={() => sort('streak')}>Streak</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedUsers?.map((user: IUser) => (
            <Tr key={user._id}>
              <Td>{user.name}</Td>
              <Td>{user.elo}</Td>
              <Td>{user.wins}</Td>
              <Td>{user.losses}</Td>
              <Td>{user.draws}</Td>
              <Td>{user.streak}</Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot />
      </Table>
    </TableContainer>
  )
}

export default Leaderboard
