import { Heading, Button, GridItem, Grid } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router'
import { MdExitToApp } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../store'
import UserNode from './UserNode'
import { setUser } from '../store/redux/user'

const Header = () => {
  const user = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return (
    <Grid
      className="header fixed-top"
      as="header"
      width="100%"
      height="64px"
      backgroundColor="#F7BB38"
      color="blueviolet"
      alignContent="center"
      templateColumns="repeat(12, 1fr)"
      templateRows="repeat(1, 64px)"
    >
      <GridItem gridColumnStart={1} gridColumnEnd={10} gridRowStart={1} display="flex" alignItems="center" justifyContent="center">
        <Heading as="h1" size="xl" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Adaptive Chess
        </Heading>
      </GridItem>
      <GridItem gridColumnStart={11} gridColumn={2} gridRowStart={1} display="flex" alignItems="center">
        <Button hidden={!!user._id} variant="ghost" onClick={() => navigate('/login')}>Login</Button>
        <Button hidden={!!user._id} variant="ghost" onClick={() => navigate('/register')}>Register</Button>
        <Button variant="ghost" onClick={() => navigate('/leaderboard')}>Leaderboard</Button>
        <UserNode hidden={!user._id} user={user} />
        <Button hidden={!user._id} variant="solid" colorScheme="pink" marginLeft="1rem" onClick={() => dispatch(setUser(null))}><MdExitToApp /></Button>
      </GridItem>
    </Grid>
  )
}

export default Header
