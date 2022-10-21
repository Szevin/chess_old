/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ColorTypes, Board as BoardClass } from 'chess-common'
import dayjs from 'dayjs'

export const Board = createApi({
  reducerPath: 'api/board',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/board' }),
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
      transformResponse: (res: BoardClass[]) => res.sort((a, b) => dayjs(b.createDate).diff(dayjs(a.createDate), 'seconds')),
    }),
  }),
})

export const { useCreateBoardMutation, useGetAllBoardsQuery } = Board
