import { apiSlice } from './apiSlice';

export const adminSearchApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGlobalSearch: builder.query({
      query: (keyword) => ({
        url: `/api/admin/search?q=${keyword}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetGlobalSearchQuery } = adminSearchApiSlice;
