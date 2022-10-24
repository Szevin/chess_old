/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IUser } from 'chess-common'

export type Channel = 'redux' | 'general'

export const User = createApi({
  reducerPath: 'api/user',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/user' }),
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    getUser: build.query<IUser, string>({
      query: (id) => `${id}`,
    }),

    getAllUsers: build.query<IUser[], void>({
      query: () => '',
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

export const { useGetUserQuery, useGetAllUsersQuery, useCreateUserMutation, useLoginUserMutation } = User
