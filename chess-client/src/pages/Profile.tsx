import { SmallCloseIcon } from '@chakra-ui/icons'
import { Button, Grid, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const navigate = useNavigate()

  const onLogout = async () => {

  }

  return (
    <Grid justifyContent="center">
      <Heading size="lg">user.fullname</Heading>
      <Text>user.email</Text>
      <Button onClick={() => onLogout()} bg="red.500" marginTop={8}>
        Kijelentkezés <SmallCloseIcon marginLeft={1} />
      </Button>
    </Grid>
  )
}

export default Profile
