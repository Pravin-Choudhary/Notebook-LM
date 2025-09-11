import type {NextAuthOptions} from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github"



export const authOptions : NextAuthOptions = {
    providers : [
    GoogleProvider ({
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
  })
],
  
    pages : {
        signIn : '/signin',
    }
}