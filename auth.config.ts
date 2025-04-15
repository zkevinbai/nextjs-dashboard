import type { NextAuthConfig } from 'next-auth';

const protectDashboardRoutes = process.env.PROTECT_DASHBOARD_ROUTES === 'true';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard && protectDashboardRoutes) {
        if (isLoggedIn) return true;
        return false;
      }

      if (isLoggedIn && protectDashboardRoutes) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
