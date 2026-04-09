import { apiSlice } from './apiSlice';

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChatHistory: builder.query({
      query: (userId) => `/api/chat/${userId}`,
      keepUnusedDataFor: 5,
    }),
    getAllChats: builder.query({
      query: () => `/api/chat`,
      keepUnusedDataFor: 5,
    }),
    markChatReadAdmin: builder.mutation({
      query: (userId) => ({
        url: `/api/chat/${userId}/read`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useGetChatHistoryQuery,
  useGetAllChatsQuery,
  useMarkChatReadAdminMutation,
} = chatApiSlice;
