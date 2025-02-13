export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  stripeKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  // Add other configuration values here
};
