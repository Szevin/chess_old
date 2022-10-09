import { Avatar, Box, HStack, Input } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Message } from 'chess-common'
import dayjs from 'dayjs'
import { useSocket } from '../store/socket'

const Chat = ({ messages } : { messages: Message[] }) => {
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
        {messages && messages.map((message) => (
          <HStack key={message.id} className="chat-message">
            <Box className="chat-message-timestamp">{dayjs(message.timestamp).format('YYYY-MM-DD hh:mm')}</Box>
            <Box className="chat-message-user">
              <Avatar name={message.user} />
            </Box>
            <Box className="chat-message-content">{message.content}</Box>
          </HStack>
        ))}
      </Box>
      <form onSubmit={handleSubmit}>
        <Input
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
