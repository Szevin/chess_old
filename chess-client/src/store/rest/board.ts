/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ColorTypes, Board as BoardClass } from 'chess-common'

export const Board = createApi({
  reducerPath: 'api/board',
  baseQuery: fetchBaseQuery({ baseUrl: 'api/board' }),
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    createBoard: build.mutation<string, { user: string, color: ColorTypes }>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),

    getAllBoards: build.query<BoardClass[], void>({
      query: () => ({
        url: '',
        method: 'GET',
      }),
    }),
  }),
})

export const { useCreateBoardMutation, useGetAllBoardsQuery } = Board
