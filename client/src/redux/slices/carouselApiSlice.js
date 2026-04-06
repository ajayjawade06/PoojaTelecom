import { apiSlice } from './apiSlice';
import { CAROUSEL_URL } from '../../constants';

export const carouselApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCarouselSlides: builder.query({
      query: () => ({
        url: CAROUSEL_URL,
      }),
      providesTags: ['Carousel'],
      keepUnusedDataFor: 30,
    }),
    getAdminCarouselSlides: builder.query({
      query: () => ({
        url: `${CAROUSEL_URL}/admin`,
      }),
      providesTags: ['Carousel'],
      keepUnusedDataFor: 5,
    }),
    createCarouselSlide: builder.mutation({
      query: (data) => ({
        url: CAROUSEL_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Carousel'],
    }),
    updateCarouselSlide: builder.mutation({
      query: (data) => ({
        url: `${CAROUSEL_URL}/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Carousel'],
    }),
    deleteCarouselSlide: builder.mutation({
      query: (id) => ({
        url: `${CAROUSEL_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Carousel'],
    }),
    reorderCarouselSlides: builder.mutation({
      query: (data) => ({
        url: `${CAROUSEL_URL}/reorder`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Carousel'],
    }),
  }),
});

export const {
  useGetCarouselSlidesQuery,
  useGetAdminCarouselSlidesQuery,
  useCreateCarouselSlideMutation,
  useUpdateCarouselSlideMutation,
  useDeleteCarouselSlideMutation,
  useReorderCarouselSlidesMutation,
} = carouselApiSlice;
