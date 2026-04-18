import { apiSlice } from './apiSlice';
import { REPORTS_URL } from '../../constants';

export const reportsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSalesReport: builder.query({
      query: ({ start, end } = {}) => {
        let url = `${REPORTS_URL}/sales`;
        if (start && end) url += `?start=${start}&end=${end}`;
        return { url };
      },
      keepUnusedDataFor: 5,
    }),
    getInventoryReport: builder.query({
      query: () => ({
        url: `${REPORTS_URL}/inventory`,
      }),
      keepUnusedDataFor: 5,
    }),
    getUserReport: builder.query({
      query: () => ({
        url: `${REPORTS_URL}/users`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetSalesReportQuery,
  useGetInventoryReportQuery,
  useGetUserReportQuery,
} = reportsApiSlice;
