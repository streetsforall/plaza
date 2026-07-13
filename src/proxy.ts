export { auth as proxy } from '@/lib/auth';

// Protected routes (anything under /mailto except those under /mailto/out)
export const config = {
  matcher: ['/mailto((?!\/?out).*)'],
};
