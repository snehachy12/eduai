import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/teacher/:path*",
    "/parent/:path*",
    "/students/:path*",
    "/messages/:path*",
  ],
};
