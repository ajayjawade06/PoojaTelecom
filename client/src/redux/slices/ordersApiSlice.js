import { apiSlice } from './apiSlice';
import { ORDERS_URL, RAZORPAY_URL } from '../../constants';

export const ordersApiSlice = apiSlice.injectEndpoints({
 endpoints: (builder) => ({
 createOrder: builder.mutation({
 query: (order) => ({
 url: ORDERS_URL,
 method: 'POST',
 body: order,
 }),
 }),
 getOrderDetails: builder.query({
 query: (id) => ({
 url: `${ORDERS_URL}/${id}`,
 }),
 keepUnusedDataFor: 5,
 }),
 payOrder: builder.mutation({
 query: ({ orderId, details }) => ({
 url: `${ORDERS_URL}/${orderId}/pay`,
 method: 'PUT',
 body: details,
 }),
 }),
 createRazorpayOrder: builder.mutation({
 query: (orderId) => ({
 url: `${ORDERS_URL}/${orderId}/razorpay`,
 method: 'POST',
 }),
 }),
 getRazorpayClientId: builder.query({
 query: () => ({
 url: RAZORPAY_URL,
 }),
 keepUnusedDataFor: 5,
 }),
 getMyOrders: builder.query({
 query: () => ({
 url: `${ORDERS_URL}/mine`,
 }),
 keepUnusedDataFor: 5,
 }),
 getOrders: builder.query({
 query: () => ({
 url: ORDERS_URL,
 }),
 keepUnusedDataFor: 5,
 }),
 deliverOrder: builder.mutation({
 query: (orderId) => ({
 url: `${ORDERS_URL}/${orderId}/deliver`,
 method: 'PUT',
 }),
 }),
 shipOrder: builder.mutation({
 query: (orderId) => ({
 url: `${ORDERS_URL}/${orderId}/shipped`,
 method: 'PUT',
 }),
 }),
 deleteOrder: builder.mutation({
 query: (orderId) => ({
 url: `${ORDERS_URL}/${orderId}`,
 method: 'DELETE',
 }),
 }),
 excludeOrder: builder.mutation({
 query: (orderId) => ({
 url: `${ORDERS_URL}/${orderId}/exclude`,
 method: 'PUT',
 }),
 }),
 cancelOrder: builder.mutation({
 query: (orderId) => ({
 url: `${ORDERS_URL}/${orderId}/cancel`,
 method: 'PUT',
 }),
 }),
 requestReturnOrder: builder.mutation({
 query: ({ orderId, returnReason }) => ({
 url: `${ORDERS_URL}/${orderId}/return`,
 method: 'PUT',
 body: { returnReason },
 }),
 }),
 processReturnOrder: builder.mutation({
 query: ({ orderId, action }) => ({
 url: `${ORDERS_URL}/${orderId}/process-return`,
 method: 'PUT',
 body: { action },
 }),
 }),
 }),
});

export const {
 useCreateOrderMutation,
 useGetOrderDetailsQuery,
 usePayOrderMutation,
 useCreateRazorpayOrderMutation,
 useGetRazorpayClientIdQuery,
 useGetMyOrdersQuery,
 useGetOrdersQuery,
 useDeliverOrderMutation,
 useShipOrderMutation,
 useDeleteOrderMutation,
 useExcludeOrderMutation,
 useCancelOrderMutation,
 useRequestReturnOrderMutation,
 useProcessReturnOrderMutation,
} = ordersApiSlice;
