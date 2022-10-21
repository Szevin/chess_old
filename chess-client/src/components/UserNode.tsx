import { Avatar, AvatarBadge, Box, Tag } from '@chakra-ui/react'
import React from 'react'
import { IUser } from 'chess-common'
import { useNavigate } from 'react-router'

// eslint-disable-next-line react/require-default-props
const UserNode = ({ user, active, hidden }: { user: IUser, active?: boolean, hidden?: boolean }) => {
  const navigate = useNavigate()

  if (hidden) return null

  return (
    <Box cursor="pointer" onClick={() => navigate(`/profile/${user._id}`)} display="flex">
      <Avatar name={user.name}>
        <AvatarBadge boxSize="1.25em" bg="green.500" hidden={!active} />
      </Avatar>
      <Tag height="50%" display="flex" alignSelf="center" marginLeft="0.2rem">{user.name}</Tag>
    </Box>
  )
}

export default UserNode
