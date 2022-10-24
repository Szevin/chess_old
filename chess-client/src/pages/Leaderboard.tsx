import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import {
  TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot,
} from '@chakra-ui/react'
import { IUser } from 'chess-common'
import React from 'react'
import { useNavigate } from 'react-router'
import { useGetAllUsersQuery } from '../store/rest/user'
import './Leaderboard.css'

const Leaderboard = () => {
  const navigate = useNavigate()

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
      <Table>
        <TableCaption>Leaderboard</TableCaption>
        <Thead>
          <Tr>
            <Th cursor="pointer" fontWeight={sortBy === 'name' ? 'extrabold' : 'none'} onClick={() => sort('name')}>Name <SortIcon sortOrder={sortOrder} hidden={sortBy !== 'name'} /></Th>
            <Th cursor="pointer" fontWeight={sortBy === 'elo' ? 'extrabold' : 'none'} onClick={() => sort('elo')}>Elo <SortIcon sortOrder={sortOrder} hidden={sortBy !== 'elo'} /></Th>
            <Th cursor="pointer" fontWeight={sortBy === 'wins' ? 'extrabold' : 'none'} onClick={() => sort('wins')}>Wins <SortIcon sortOrder={sortOrder} hidden={sortBy !== 'wins'} /></Th>
            <Th cursor="pointer" fontWeight={sortBy === 'losses' ? 'extrabold' : 'none'} onClick={() => sort('losses')}>Losses <SortIcon sortOrder={sortOrder} hidden={sortBy !== 'losses'} /></Th>
            <Th cursor="pointer" fontWeight={sortBy === 'draws' ? 'extrabold' : 'none'} onClick={() => sort('draws')}>Draws <SortIcon sortOrder={sortOrder} hidden={sortBy !== 'draws'} /></Th>
            <Th cursor="pointer" fontWeight={sortBy === 'streak' ? 'extrabold' : 'none'} onClick={() => sort('streak')}>Streak <SortIcon sortOrder={sortOrder} hidden={sortBy !== 'streak'} /></Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedUsers?.map((user: IUser) => (
            <Tr key={user._id} cursor="pointer" className="user" onClick={() => navigate(`../profile/${user._id}`)}>
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

const SortIcon = ({ hidden, sortOrder }: { hidden: boolean, sortOrder : 'asc' | 'desc' }) => {
  if (hidden) return null
  return sortOrder === 'asc' ? (
    <ChevronUpIcon marginLeft={0} w="1.5rem" h="1.5rem" />
  ) : (
    <ChevronDownIcon marginLeft={0} w="1.5rem" h="1.5rem" />
  )
}

export default Leaderboard
