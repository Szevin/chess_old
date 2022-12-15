import { Box, HStack, Input, Tag } from '@chakra-ui/react'
import React, { useState } from 'react'
import { IUser, Message } from 'chess-common'
import dayjs from 'dayjs'
import { useSocket } from '../store/socket'

const Chat = ({ messages, readonly, black, white } : { messages: Message[], readonly: boolean, black: IUser, white: IUser }) => {
  const [newMessage, setNewMessage] = useState('')
  const { message } = useSocket()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    message(newMessage)
    setNewMessage('')
    window.scrollTo(0, document.body.scrollHeight)
  }

  return (
    <Box>
      <Box>
        {messages && messages.map((m) => (
          <HStack key={m.id}>
            <Box>{dayjs(m.timestamp).format('YYYY-MM-DD hh:mm')}</Box>
            <Box>
              <Tag
                color={m.user._id === white._id ? 'black' : m.user._id === black._id ? 'white' : 'white'}
                backgroundColor={m.user._id === white._id ? 'white' : m.user._id === black._id ? 'black' : 'red'}
              >{(m.user as IUser)?.name}
              </Tag>
            </Box>
            <Box>{m.content}</Box>
          </HStack>
        ))}
      </Box>
      <form onSubmit={handleSubmit}>
        <Input
          marginTop="1rem"
          marginBottom="6rem"
          disabled={readonly}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
      </form>
    </Box>
  )
}

export default Chat
