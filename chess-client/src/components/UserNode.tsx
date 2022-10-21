import { Avatar, AvatarBadge, Box, Tag } from '@chakra-ui/react'
import React from 'react'
import { IUser } from 'chess-common'
import { useNavigate } from 'react-router'

// eslint-disable-next-line react/require-default-props
const UserNode = ({ user, active, hidden }: { user: IUser, active?: boolean, hidden?: boolean }) => {
  const navigate = useNavigate()

  if (hidden) return null

  return (
    <Box cursor="pointer" onClick={() => navigate(`/profile/${user._id}`)}>
      <Avatar name={user.name}>
        <AvatarBadge boxSize="1.25em" bg="green.500" hidden={!active} />
      </Avatar>
      <Tag>{user.name}</Tag>
    </Box>
  )
}

export default UserNode
