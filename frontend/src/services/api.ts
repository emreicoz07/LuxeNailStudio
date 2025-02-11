import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  }),
  endpoints: (builder) => ({
    // We'll add endpoints here as we build features
  }),
}); 