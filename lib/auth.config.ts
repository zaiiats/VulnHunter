import { NextResponse } from "next/server";
import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [GitHub, Google],
  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as "RESEARCHER" | "COMPANY" | "ADMIN";
        session.user.id = token.id as string;
      }
      return session;
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;

      const isAuthRoute =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

      const isAdminRoute = nextUrl.pathname.startsWith("/admin");

      const isProtectedRoute =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/reports") ||
        nextUrl.pathname.startsWith("/programs") ||
        nextUrl.pathname.startsWith("/account") ||
        isAdminRoute;

      if (isAuthRoute) {
        if (isLoggedIn) {
          return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      if (isProtectedRoute && !isLoggedIn) {
        return false;
      }

      if (isAdminRoute && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
};
