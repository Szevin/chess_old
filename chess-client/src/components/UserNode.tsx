import { Avatar, AvatarBadge, Tag } from '@chakra-ui/react'
import React from 'react'
import { IUser } from 'chess-common'

const UserNode = ({ user, current, color }: { user: IUser, current: 'white' | 'black', color: 'white' | 'black' }) => (
  <>
    <Avatar name={user.name} src={user.avatar}>
      <AvatarBadge boxSize="1.25em" bg="green.500" hidden={color !== current} />
    </Avatar>
    <Tag>{user.name}</Tag>
  </>
)

export default UserNode
