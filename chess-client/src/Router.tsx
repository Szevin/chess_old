import { Box, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router'

import Layout from './components/Layout'
import Game from './pages/Game'
import Leaderboard from './pages/Leaderboard'
import Login from './pages/Login'
import Main from './pages/Main'
import Profile from './pages/Profile'
import Register from './pages/Register'
import { useAppDispatch, useAppSelector } from './store'
import { toggleLanguage, toggleTheme } from './store/redux/settings'

const Router = () => {
  const user = useAppSelector((state) => state.user)
  const settings = useAppSelector((state) => state.settings)
  const dispatch = useAppDispatch()

  const defaultLanguage = localStorage.getItem('language') ?? 'en'
  const defaultTheme = localStorage.getItem('theme') ?? 'light'

  if (settings.language !== defaultLanguage) {
    dispatch(toggleLanguage())
  }
  if (settings.theme !== defaultTheme) {
    dispatch(toggleTheme())
  }

  const { colorMode } = useColorMode()

  return (
    <Box backgroundColor={colorMode === 'light' ? 'whitesmoke' : 'blueviolet'} height="100vh">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="board/:id" element={<Game />} />

          { !user._id && (
          <>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </>
          ) }

          <Route path="profile/:id" element={<Profile />} />
          <Route path="leaderboard" element={<Leaderboard />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Box>
  )
}

export default Router
