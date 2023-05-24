import NextAuth, { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { connectToDB } from "@utils/database";
import User from "@models/User";

const authOptions = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }: { session: Session }) {
      const sessionUser = await User.findOne({ email: session.user?.email });

      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({ profile }) {
      try {
        // serverLess > Lambda
        await connectToDB();
        const userExist = await User.findOne({ email: profile?.email });

        if (userExist === null) {
          await User.create({
            email: profile?.email,
            username: profile?.name?.replace(" ", "").toLowerCase(),
            image: profile?.image,
          });
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});

export { authOptions as GET, authOptions as POST };
