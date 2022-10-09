import { Avatar, AvatarBadge, Tag } from '@chakra-ui/react'
import React from 'react'
import { IUser } from 'chess-common'

const UserNode = ({ user }: { user: IUser }) => (
  <Avatar>
    <Tag>{user.name}</Tag>
    <AvatarBadge boxSize="1.25em" bg="green.500" />
  </Avatar>
)

export default UserNode
