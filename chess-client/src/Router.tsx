import React from 'react'
import { Navigate, Route, Routes } from 'react-router'

import Layout from './components/Layout'
import Game from './pages/Game'
import Login from './pages/Login'
import Main from './pages/Main'
import Register from './pages/Register'

const Router = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Main />} />
      <Route path="board/:id" element={<Game />} />

      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route path="*" element={<Navigate to="login" replace />} />
    </Route>
  </Routes>
)

export default Router
