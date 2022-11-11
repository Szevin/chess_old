import { Heading, Button, GridItem, Grid } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router'
import { MdExitToApp } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../store'
import UserNode from './UserNode'
import { setUser } from '../store/redux/user'
import useTranslate from '../hooks/useTranslate'
import HuSvg from '../assets/flags/hu'
import EnSvg from '../assets/flags/en'

const Header = () => {
  const user = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const t = useTranslate()
  const currentLanguage = localStorage.getItem('language')

  const toggleLanguage = () => {
    localStorage.setItem('language', currentLanguage === 'hu' ? 'en' : 'hu')
    window.location.reload()
  }

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
      <GridItem colSpan={1} rowSpan={1} alignSelf="center" justifySelf="center" style={{ cursor: 'pointer' }} onClick={() => toggleLanguage()}>
        {currentLanguage === 'hu' ? (
          <HuSvg />
        ) : (
          <EnSvg />
        )}
      </GridItem>
      <GridItem gridColumnStart={2} gridColumnEnd={10} gridRowStart={1} display="flex" alignItems="center" justifyContent="center">
        <Heading as="h1" size="xl" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          {t('header.title')}
        </Heading>
      </GridItem>
      <GridItem gridColumnStart={11} gridColumn={2} gridRowStart={1} display="flex" alignItems="center">
        <Button variant="ghost" onClick={() => navigate('/leaderboard')}>{t('header.leaderboard')}</Button>
        <Button hidden={!!user._id} variant="ghost" onClick={() => navigate('/login')}>{t('header.login')}</Button>
        <Button hidden={!!user._id} variant="ghost" onClick={() => navigate('/register')}>{t('header.register')}</Button>
        <UserNode hidden={!user._id} user={user} />
        <Button hidden={!user._id} variant="solid" colorScheme="pink" marginLeft="1rem" onClick={() => { dispatch(setUser(null)); navigate('/login') }}><MdExitToApp /></Button>
      </GridItem>
    </Grid>
  )
}

export default Header
