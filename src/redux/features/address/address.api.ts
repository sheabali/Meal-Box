// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { baseApi } from '@/redux/api/baseApi';

// const addressApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getAllAddress: builder.query({
//       query: (data) => {
//         const params = new URLSearchParams();
//         if (data) {
//           data?.forEach((item: any) => {
//             params.append(item.name, item.value as string);
//           });
//         }
//         return {
//           url: `/address`,
//           method: 'GET',
//           params: params,
//         };
//       },
//       providesTags: ['address'],
//     }),

//     getMyAddress: builder.query({
//       query: () => ({
//         url: `/address/get-my-address`,
//         method: 'GET',
//       }),
//       providesTags: ['address'],
//     }),

//     createAddress: builder.mutation({
//       query: (data) => {
//         return {
//           url: '/address',
//           method: 'POST',
//           body: data,
//         };
//       },
//       invalidatesTags: ['address'],
//     }),

//     updateAddress: builder.mutation({
//       query: (data) => {
//         return {
//           url: '/address',
//           method: 'PATCH',
//           body: data,
//         };
//       },
//       invalidatesTags: ['address'],
//     }),

//     deleteContactMessage: builder.mutation({
//       query: (id) => {
//         return {
//           url: `/address/${id}`,
//           method: 'DELETE',
//         };
//       },
//       invalidatesTags: ['address'],
//     }),
//   }),
// });

// export const {
//   useCreateAddressMutation,
//   useUpdateAddressMutation,
//   useGetMyAddressQuery,
// } = addressApi;
