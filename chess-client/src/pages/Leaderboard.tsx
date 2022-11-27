import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import {
  TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, Box, Select,
} from '@chakra-ui/react'
import { GameType, IUser } from 'chess-common'
import React from 'react'
import { useNavigate } from 'react-router'
import useTranslate from '../hooks/useTranslate'
import { useGetAllUsersQuery } from '../store/rest/user'
import './Leaderboard.css'

type ColType = 'name' | 'elo' | 'wins' | 'losses' | 'draws' | 'streak'

const Leaderboard = () => {
  const navigate = useNavigate()

  const [sortBy, setSortBy] = React.useState<ColType>('elo')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')
  const [gameType, setGameType] = React.useState<GameType>('normal')
  const t = useTranslate()

  const { data: users } = useGetAllUsersQuery()
  const sortedUsers = React.useMemo(() => {
    if (!users) return []
    return [...users].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }
      if (a.stats[gameType][sortBy] > b.stats[gameType][sortBy]) return sortOrder === 'asc' ? 1 : -1
      if (a.stats[gameType][sortBy] < b.stats[gameType][sortBy]) return sortOrder === 'asc' ? -1 : 1
      return 0
    })
  }, [users, sortBy, sortOrder])

  const sort = (key: ColType) => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortOrder('desc')
    }
  }

  return (
    <Box>
      <Select
        width="30%"
        defaultValue="normal"
        marginX="auto"
        onChange={(e) => setGameType(e.target.value as GameType)}
      >
        <option value="normal">{t('game.type.normal')}</option>
        <option value="adaptive">{t('game.type.adaptive')}</option>
        <option value="custom">{t('game.type.custom')}</option>
      </Select>
      <TableContainer>
        <Table>
          <TableCaption>{t('leaderboard.title')}</TableCaption>
          <Thead>
            <Tr>
              <Th cursor="pointer" fontWeight={sortBy === 'name' ? 'extrabold' : 'none'} onClick={() => sort('name')}>
                {t('leaderboard.user.name')}
                <SortIcon sortOrder={sortOrder} hidden={sortBy !== 'name'} />
              </Th>
              <Th cursor="pointer" fontWeight={sortBy === 'elo' ? 'extrabold' : 'none'} onClick={() => sort('elo')}>
                {t('leaderboard.user.elo')}
                <SortIcon sortOrder={sortOrder} hidden={sortBy !== 'elo'} />
              </Th>
              <Th cursor="pointer" fontWeight={sortBy === 'wins' ? 'extrabold' : 'none'} onClick={() => sort('wins')}>
                {t('leaderboard.user.wins')}
                <SortIcon sortOrder={sortOrder} hidden={sortBy !== 'wins'} />
              </Th>
              <Th cursor="pointer" fontWeight={sortBy === 'losses' ? 'extrabold' : 'none'} onClick={() => sort('losses')}>
                {t('leaderboard.user.losses')}
                <SortIcon sortOrder={sortOrder} hidden={sortBy !== 'losses'} />
              </Th>
              <Th cursor="pointer" fontWeight={sortBy === 'draws' ? 'extrabold' : 'none'} onClick={() => sort('draws')}>
                {t('leaderboard.user.draws')}
                <SortIcon sortOrder={sortOrder} hidden={sortBy !== 'draws'} />
              </Th>
              <Th cursor="pointer" fontWeight={sortBy === 'streak' ? 'extrabold' : 'none'} onClick={() => sort('streak')}>
                {t('leaderboard.user.streak')}
                <SortIcon sortOrder={sortOrder} hidden={sortBy !== 'streak'} />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedUsers?.map((user: IUser) => (
              <Tr key={user._id} cursor="pointer" className="user" onClick={() => navigate(`../profile/${user._id}`)}>
                <Td>{user.name}</Td>
                <Td>{user.stats[gameType].elo}</Td>
                <Td>{user.stats[gameType].wins}</Td>
                <Td>{user.stats[gameType].losses}</Td>
                <Td>{user.stats[gameType].draws}</Td>
                <Td>{user.stats[gameType].streak}</Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot />
        </Table>
      </TableContainer>
    </Box>
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
