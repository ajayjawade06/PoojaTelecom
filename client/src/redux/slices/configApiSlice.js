import { apiSlice } from './apiSlice';

export const configApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConfig: builder.query({
      query: () => ({ url: '/api/config' }),
      keepUnusedDataFor: 5,
    }),
    updateConfig: builder.mutation({
      query: (data) => ({
        url: '/api/config',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const { useGetConfigQuery, useUpdateConfigMutation } = configApiSlice;
