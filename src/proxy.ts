export { auth as proxy } from '@/lib/auth';

// Protected routes (anything under /edit)
export const config = {
  matcher: ['/(\/?edit.*)'],
};
