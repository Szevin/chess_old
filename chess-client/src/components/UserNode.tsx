import { Avatar, AvatarBadge, Box, Tag } from '@chakra-ui/react'
import React from 'react'
import { IUser } from 'chess-common'
import { useNavigate } from 'react-router'
// import { useAppSelector } from '../store'

// eslint-disable-next-line react/require-default-props
const UserNode = ({ user, current, color, hidden }: { user: IUser, current?: 'white' | 'black', color?: 'white' | 'black', hidden?: boolean }) => {
  // const currentUser = useAppSelector((state) => state.user)
  const navigate = useNavigate()

  if (hidden) return null

  return (
    <Box cursor="pointer" onClick={() => navigate(`/profile/${user._id}`)}>
      <Avatar name={user.name} src={user.avatar}>
        <AvatarBadge boxSize="1.25em" bg="green.500" hidden={color !== current} />
      </Avatar>
      <Tag>{user.name}</Tag>
    </Box>
  )
}

export default UserNode
