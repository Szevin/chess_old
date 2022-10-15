/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IUser } from 'chess-common'

const initialState = {
  _id: null,
  name: '',
  email: '',
  password: '',
  avatar: '',
  elo: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  streak: 0,
  games: [],
} as unknown as IUser

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser | null>) {
      if (!action.payload) {
        Object.assign(state, initialState)
      }
      Object.assign(state, action.payload)
    },
  },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
