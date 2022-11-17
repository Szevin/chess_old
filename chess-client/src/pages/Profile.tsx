import {
  Avatar, Box, Heading, HStack, Select, Text, VStack,
} from '@chakra-ui/react'
import { GameType } from 'chess-common'
import React from 'react'
import { useParams } from 'react-router'
import useTranslate from '../hooks/useTranslate'
// import { useAppSelector } from '../store'
import { useGetUserQuery } from '../store/rest/user'

const Profile = () => {
  const { id } = useParams() as { id: string }
  const { data: user, isFetching, error } = useGetUserQuery(id)
  const t = useTranslate()

  const [gameType, setGameType] = React.useState<GameType>('normal')

  if (error) {
    return (
      <HStack justifyContent="center">
        <Heading size="lg" marginRight="2">User not found!</Heading>
      </HStack>
    )
  }

  if (!user || isFetching) {
    return (
      <HStack justifyContent="center">
        <Heading size="lg" marginRight="2">Loading</Heading>
        <Box className="dot-elastic align-self-end" />
      </HStack>
    )
  }

  return (
    <VStack display="flex" justifyContent="center">
      <Avatar name={user.name} src={user.avatar} />
      <Heading as="h1" size="lg">
        {`${t('user.name')}: ${user.name}`}
      </Heading>
      <Text>{`${t('user.email')}: ${user.email}`}</Text>
      <Select
        width="20%"
        defaultValue="normal"
        onChange={(e) => setGameType(e.target.value as GameType)}
      >
        <option value="normal">{t('game.type.normal')}</option>
        <option value="adaptive">{t('game.type.adaptive')}</option>
        <option value="custom">{t('game.type.custom')}</option>
      </Select>
      <Text>{`${t('user.stats.elo')}: ${user.stats[gameType].elo}`}</Text>
      <Text>{`${t('user.stats.wins')}: ${user.stats[gameType].wins}`}</Text>
      <Text>{`${t('user.stats.losses')}: ${user.stats[gameType].losses}`}</Text>
      <Text>{`${t('user.stats.draws')}: ${user.stats[gameType].draws}`}</Text>
      <Text>{`${t('user.stats.streak')}: ${user.stats[gameType].streak}`}</Text>
    </VStack>
  )
}

export default Profile
