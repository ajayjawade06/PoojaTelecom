import { SUBSCRIBERS_URL } from '../../constants';
import { apiSlice } from './apiSlice';

export const subscribersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    subscribe: builder.mutation({
      query: (data) => ({
        url: `${SUBSCRIBERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    getSubscribers: builder.query({
      query: () => ({
        url: SUBSCRIBERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useSubscribeMutation,
  useGetSubscribersQuery,
} = subscribersApiSlice;
