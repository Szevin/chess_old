/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export type Channel = 'redux' | 'general'

export interface User {
  text: string
}

export const user = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/user' }),
  endpoints: (build) => ({
    getBoard: build.query<User, void>({
      query: () => '',
    }),
  }),
})

export const { useGetBoardQuery } = user
