/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ColorTypes } from 'chess-common'

export const Board = createApi({
  reducerPath: 'api/board',
  baseQuery: fetchBaseQuery({ baseUrl: 'api/board' }),
  endpoints: (build) => ({
    createBoard: build.mutation<string, { user: string, color: ColorTypes }>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useCreateBoardMutation } = Board
