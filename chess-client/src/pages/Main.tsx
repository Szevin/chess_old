import { Button, Input, useToast } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router'

const Main = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [id, setId] = React.useState<string>()

  const handleJoin = () => {
    if (!id) {
      toast({
        title: 'Invalid ID',
        description: 'Please enter a valid ID',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }
    navigate(`/board/${id}`)
  }

  return (
    <>
      <Input onChange={(e) => setId(e.target.value)} onKeyDown={(e) => (e.key === 'Enter' ? handleJoin() : null)} />
      <Button onClick={handleJoin}>Join Board</Button>
      <Button>Create Board</Button>
    </>
  )
}

export default Main
