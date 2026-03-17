import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongoose";
import User from "@/lib/models/user";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
        role:     { label: "Role",     type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        const user = await User.findOne({ email: credentials.email }).select("+password");
        if (!user) throw new Error("No account found with this email");

        const valid = await user.comparePassword(credentials.password);
        if (!valid) throw new Error("Incorrect password");

        if (user.role !== credentials.role) {
          throw new Error(`This account is registered as ${user.role}, not ${credentials.role}`);
        }

        return {
          id:    user._id.toString(),
          name:  user.name,
          email: user.email,
          role:  user.role,
          avatarColor: user.avatarColor,
        };
      },
    }),

    // Optional: Google OAuth (add GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET to .env)
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = (user as any).role;
        token.avatarColor = (user as any).avatarColor;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id   = token.id;
        (session.user as any).role = token.role;
        (session.user as any).avatarColor = token.avatarColor;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };