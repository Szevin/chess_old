/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IUser } from 'chess-common'

export type Channel = 'redux' | 'general'

export const User = createApi({
  reducerPath: 'api/user',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.DEV ? 'http://szevin2.ddns.net:3030/api/user' : '/api/user' }),
  endpoints: (build) => ({
    getUser: build.query<IUser, string>({
      query: (id) => `${id}`,
    }),

    createUser: build.mutation<IUser, { name: string, email: string, password: string }>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),

    loginUser: build.mutation<IUser, { name: string, password: string }>({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useGetUserQuery, useCreateUserMutation, useLoginUserMutation } = User
