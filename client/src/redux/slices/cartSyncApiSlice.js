import { apiSlice } from './apiSlice';

export const cartSyncApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    syncCart: builder.mutation({
      query: (data) => ({
        url: '/api/cart/sync',
        method: 'POST',
        body: data,
      }),
    }),
    getAbandonedCarts: builder.query({
      query: () => ({
        url: '/api/cart/abandoned',
      }),
      keepUnusedDataFor: 10,
    }),
    markCartRecovered: builder.mutation({
      query: (id) => ({
        url: `/api/cart/abandoned/${id}/recover`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useSyncCartMutation,
  useGetAbandonedCartsQuery,
  useMarkCartRecoveredMutation,
} = cartSyncApiSlice;
