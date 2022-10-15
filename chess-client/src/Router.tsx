import React from 'react'
import { Navigate, Route, Routes } from 'react-router'

import Layout from './components/Layout'
import Game from './pages/Game'
import Login from './pages/Login'
import Main from './pages/Main'
import Profile from './pages/Profile'
import Register from './pages/Register'
import { useAppSelector } from './store'

const Router = () => {
  const user = useAppSelector((state) => state.user)

  return (
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default Router
