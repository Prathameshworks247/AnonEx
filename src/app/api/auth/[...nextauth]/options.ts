import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import CredentialsProviders from "next-auth/providers/credentials";
import dbConnect  from "@/lib/dbConnect";
import UserModel from "@/model/User";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { AuthOptions } from "next-auth";

export const authoptions: NextAuthOptions = {
    
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),
        CredentialsProviders({
            id: "credentials",
            name: "Credentials",
            credentials:{
                email:{label:"Email", type:"email", placeholder:"Enter your email"},
                password: {label:"Password", type:"password", placeholder:"Enter your password"}
            },
            async authorize(credentials:any):Promise<any>{
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [{ email: credentials.identifier },{ username: credentials.identifier }]
                    })
                    if (!user) {
                        throw new Error("No user found with the given credentials");
                    }
                    if (!user.isVerified){
                        throw new Error("Please verify your email before logging in");
                    }
                    const isPasswordCorrect =  await bcrypt.compare(credentials.password,user.password)
                    if (isPasswordCorrect) {
                        return user;    
                    } else {
                        throw new Error("Incorrect password");
                    }
                } catch (error:any) {
                    throw new Error(error.message);
                }            
            
            }

        })
       
    ],
    pages:{
        signIn: "/sign-in",
        error: "/auth/error",
        verifyRequest: "/auth/verify-request"
        },
    session:{
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
    
}