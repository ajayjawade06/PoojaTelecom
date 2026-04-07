import { apiSlice } from './apiSlice';
import { PRODUCTS_URL } from '../../constants';

export const productsApiSlice = apiSlice.injectEndpoints({
 endpoints: (builder) => ({
 getProducts: builder.query({
 query: (params) => ({
 url: PRODUCTS_URL,
 params,
 }),
 providesTags: ['Product'],
 keepUnusedDataFor: 5,
 }),
 getCategoriesAndBrands: builder.query({
 query: () => ({
 url: `${PRODUCTS_URL}/filters`,
 }),
 keepUnusedDataFor: 5,
 }),
 getProductDetails: builder.query({
 query: (productId) => ({
 url: `${PRODUCTS_URL}/${productId}`,
 }),
 keepUnusedDataFor: 5,
 }),
 createProduct: builder.mutation({
 query: () => ({
 url: PRODUCTS_URL,
 method: 'POST',
 }),
 invalidatesTags: ['Product'],
 }),
 updateProduct: builder.mutation({
 query: (data) => ({
 url: `${PRODUCTS_URL}/${data.productId}`,
 method: 'PUT',
 body: data,
 }),
 invalidatesTags: ['Product'],
 }),
 uploadProductImage: builder.mutation({
 query: (data) => ({
 url: `/api/upload`,
 method: 'POST',
 body: data,
 }),
 }),
 deleteProduct: builder.mutation({
 query: (productId) => ({
 url: `${PRODUCTS_URL}/${productId}`,
 method: 'DELETE',
 }),
 invalidatesTags: ['Product'],
 }),
 createReview: builder.mutation({
 query: (data) => ({
 url: `${PRODUCTS_URL}/${data.productId}/reviews`,
 method: 'POST',
 body: data,
 }),
 invalidatesTags: ['Product'],
 }),
 bulkUpdateStock: builder.mutation({
 query: (data) => ({
 url: `${PRODUCTS_URL}/bulk-stock`,
 method: 'PUT',
 body: data,
 }),
 invalidatesTags: ['Product'],
 }),
 getUserReviews: builder.query({
 query: (userId) => ({
 url: `${PRODUCTS_URL}/reviews/user/${userId}`,
 }),
 providesTags: ['Product'],
 keepUnusedDataFor: 5,
 }),
 deleteReviewAdmin: builder.mutation({
 query: (data) => ({
 url: `${PRODUCTS_URL}/${data.productId}/reviews/${data.reviewId}`,
 method: 'DELETE',
 }),
 invalidatesTags: ['Product'],
 }),
 }),
});

export const {
 useGetProductsQuery,
 useGetCategoriesAndBrandsQuery,
 useGetProductDetailsQuery,
 useCreateProductMutation,
 useUpdateProductMutation,
 useUploadProductImageMutation,
 useDeleteProductMutation,
 useCreateReviewMutation,
 useBulkUpdateStockMutation,
 useGetUserReviewsQuery,
 useDeleteReviewAdminMutation,
} = productsApiSlice;
