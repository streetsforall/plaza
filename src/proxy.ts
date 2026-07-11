export { auth as proxy } from '@/lib/auth';

// Protected routes
export const config = {
  matcher: ['/mailto'],
};
