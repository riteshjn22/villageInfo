import { withAuth } from "next-auth/middleware";

// Requires an admin login for:
//  - the dashboard
//  - every write to the API (POST/PUT/PATCH/DELETE) — these were open to anyone
//  - /api/download/* — returns whole tables (heavy on Atlas' 10 GB/week transfer)
// Public pages no longer call /api/*, so normal visitors never hit this.
export const proxy = withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ req, token }) {
      const { pathname } = req.nextUrl;

      if (pathname.startsWith("/dashboard")) return !!token;
      if (pathname.startsWith("/api/download")) return !!token;
      if (pathname.startsWith("/api/") && req.method !== "GET") return !!token;

      return true;
    },
  },
});

export const config = {
  // /api/auth (login) and /api/revalidate (secret-protected) stay open
  matcher: ["/dashboard/:path*", "/api/((?!auth|revalidate).*)"],
};
