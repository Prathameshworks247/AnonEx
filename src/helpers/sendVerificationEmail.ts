import { resend } from "@/lib/resend";
import { VerificationEmail } from "@/../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { email, string, success } from "zod/v4-mini";


export async function sendVerificationEmail(email:string,username:string,otp:string):Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Email',
            react: VerificationEmail({ username: username, otp: otp }),
          });
        
        return {success:true,message:"Verification email sent successfully"}; // Return early if email is already sent
    } catch (emailError) {
        console.log("Error sending verification email:", emailError);
        return {
            success: false,
            message: "Failed to send verification email",
        };
    }

}
