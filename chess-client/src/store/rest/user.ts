/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IUser } from 'chess-common'

export type Channel = 'redux' | 'general'

export const user = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/user' }),
  endpoints: (build) => ({
    getBoard: build.query<IUser, void>({
      query: () => '',
    }),
  }),
})

export const { useGetBoardQuery } = user
