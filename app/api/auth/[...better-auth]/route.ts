import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

/**
 * Better-Auth Route Handler:
 * This is the unified entry point for all authentication-related API requests.
 * It automatically handles both GET (session retrieval, OAuth callbacks) and
 * POST (sign-in, sign-up, password reset) methods by bridging Better-Auth with Next.js.
 */
export const { GET, POST } = toNextJsHandler(auth);
