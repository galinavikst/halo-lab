import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_GAME_URL;

export const gameApi = createApi({
  reducerPath: "gameApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getProducts: builder.query<any, void>({
      query: () => ``,
    }),

    addUser: builder.mutation<
      { id: string },
      { name: string; complexity: number }
    >({
      query: (body) => ({
        url: "/init",
        method: "POST",
        body,
      }),
    }),

    getTokenChunk: builder.query<
      { no: number; chunk: string },
      { chunkNo: number; id: string }
    >({
      query: ({ chunkNo, id }) => `/token/${chunkNo}?id=${id}`,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetTokenChunkQuery,
  useLazyGetTokenChunkQuery,
  useAddUserMutation,
} = gameApi;
