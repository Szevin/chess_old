import {
  Heading, Button, GridItem, Grid, useColorMode, HStack, Box,
} from '@chakra-ui/react'
import React from 'react'
import { useLocation, useNavigate } from 'react-router'
import { MdExitToApp } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../store'
import UserNode from './UserNode'
import { setUser } from '../store/redux/user'
import useTranslate from '../hooks/useTranslate'
import HuSvg from '../assets/flags/hu'
import EnSvg from '../assets/flags/en'
import { toggleLanguage } from '../store/redux/settings'
import { useGetAllBoardsQuery } from '../store/rest/board'

const Header = () => {
  const user = useAppSelector((state) => state.user)
  const language = useAppSelector((state) => state.settings.language)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const t = useTranslate()
  const { colorMode, toggleColorMode } = useColorMode()
  const { pathname } = useLocation()
  const { refetch: refetchBoards } = useGetAllBoardsQuery()

  return (
    <Grid
      className="header fixed-top"
      as="header"
      width="100%"
      height="64px"
      backgroundColor={colorMode === 'light' ? 'gray.200' : 'gray.900'}
      color="blueviolet"
      alignContent="center"
      templateColumns="repeat(12, 1fr)"
      templateRows="repeat(1, 64px)"
    >
      <GridItem style={{ marginLeft: '1rem' }} colSpan={1} rowSpan={1} alignSelf="center" justifySelf="center">
        <HStack>
          <Button backgroundColor={colorMode === 'light' ? 'black' : 'white'} onClick={toggleColorMode}>
            {t(colorMode === 'light' ? 'header.darkmode' : 'header.lightmode')}
          </Button>
          <Box style={{ cursor: 'pointer', marginRight: '1rem' }} onClick={() => dispatch(toggleLanguage())}>
            {language === 'hu' ? (
              <HuSvg />
            ) : (
              <EnSvg />
            )}
          </Box>
        </HStack>
      </GridItem>
      <GridItem gridColumnStart={2} gridColumnEnd={10} gridRowStart={1} display="flex" alignItems="center" justifyContent="center">
        <Heading as="h1" size="xl" style={{ cursor: 'pointer' }} onClick={() => { navigate('/'); refetchBoards() }}>
          {t('header.title')}
        </Heading>
      </GridItem>
      <GridItem gridColumnStart={11} gridColumn={2} gridRowStart={1} display="flex" alignItems="center">
        <Button backgroundColor={pathname === '/leaderboard' ? 'cyan.400' : ''} variant="ghost" onClick={() => navigate('/leaderboard')}>{t('header.leaderboard')}</Button>
        <Button backgroundColor={pathname === '/login' ? 'cyan.400' : ''} hidden={!!user._id} variant="ghost" onClick={() => navigate('/login')}>{t('header.login')}</Button>
        <Button backgroundColor={pathname === '/register' ? 'cyan.400' : ''} hidden={!!user._id} variant="ghost" onClick={() => navigate('/register')}>{t('header.register')}</Button>
        <Box>
          <UserNode hidden={!user._id} user={user} />
        </Box>
        <Button hidden={!user._id} variant="solid" colorScheme="pink" marginLeft="1rem" onClick={() => { dispatch(setUser(null)); navigate('/login') }}><MdExitToApp /></Button>
      </GridItem>
    </Grid>
  )
}

export default Header
