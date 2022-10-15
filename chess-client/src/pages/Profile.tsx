import {
  Avatar, Box, Heading, HStack, Text,
} from '@chakra-ui/react'
import React from 'react'
import { useParams } from 'react-router'
// import { useAppSelector } from '../store'
import { useGetUserQuery } from '../store/rest/user'

const Profile = () => {
  const { id } = useParams() as { id: string }
  const { data: user, isFetching, error } = useGetUserQuery(id)
  // const currentUser = useAppSelector((state) => state.user)

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
    <Box display="flex" justifyContent="center">
      <Avatar name={user.name} src={user.avatar}>
        <Heading as="h1" size="lg">
          {user.name}
        </Heading>
      </Avatar>
      <Text>{user.email}</Text>
      <Text>{user.elo}</Text>
      <Text>{user.wins}</Text>
      <Text>{user.losses}</Text>
      <Text>{user.draws}</Text>
      <Text>{user.streak}</Text>
    </Box>
  )
}

export default Profile
