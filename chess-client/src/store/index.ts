import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

import { User } from './rest/user'
import { Board } from './rest/board'
import boardReducer from './redux/board'
import userReducer from './redux/user'
import settingsReducer from './redux/settings'

export const store = configureStore({
  reducer: {
    [User.reducerPath]: User.reducer,
    [Board.reducerPath]: Board.reducer,
    board: boardReducer,
    user: userReducer,
    settings: settingsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
    .concat(Board.middleware)
    .concat(User.middleware),
})

type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
