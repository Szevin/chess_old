import { Avatar, Box, HStack, Input } from '@chakra-ui/react'
import React, { useState } from 'react'
import { IUser, Message } from 'chess-common'
import dayjs from 'dayjs'
import { useSocket } from '../store/socket'

const Chat = ({ messages, readonly } : { messages: Message[], readonly: boolean }) => {
  const [newMessage, setNewMessage] = useState('')
  const { message } = useSocket()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    message(newMessage)
    setNewMessage('')
  }

  return (
    <Box className="chat">
      <Box className="chat-messages">
        {messages && messages.map((m) => (
          <HStack key={m.id} className="chat-message">
            <Box className="chat-message-timestamp">{dayjs(m.timestamp).format('YYYY-MM-DD hh:mm')}</Box>
            <Box className="chat-message-user">
              <Avatar name={(m.user as IUser)?.name} />
            </Box>
            <Box className="chat-message-content">{m.content}</Box>
          </HStack>
        ))}
      </Box>
      <form onSubmit={handleSubmit}>
        <Input
          disabled={readonly}
          className="chat-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
      </form>
    </Box>
  )
}

export default Chat
