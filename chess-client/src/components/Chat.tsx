import { Box, HStack, Input, Tag } from '@chakra-ui/react'
import React, { useState } from 'react'
import { IUser, Message } from 'chess-common'
import dayjs from 'dayjs'
import { useSocket } from '../store/socket'

const Chat = ({ messages, readonly, blackId, whiteId } : { messages: Message[], readonly: boolean, blackId: string, whiteId: string }) => {
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
                color={m.user._id === whiteId ? 'black' : m.user._id === blackId ? 'white' : 'white'}
                backgroundColor={m.user._id === whiteId ? 'white' : m.user._id === blackId ? 'black' : 'red'}
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
