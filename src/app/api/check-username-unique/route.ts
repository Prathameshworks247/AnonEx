import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { success } from "zod/v4-mini";

const usernameQuerySchema = z.object({
    username: usernameValidation 
})

export async function GET(request:Request) {
    // if (request.method !== "GET") {
    //     return new Response(JSON.stringify({ success: false, message: "Method Not Allowed" }), { status: 405 });
        
    // }
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        };

        const result = usernameQuerySchema.safeParse(queryParam);
        console.log(result);
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: "Invalid username",
                errors: usernameErrors
            },{status: 400});
        } 
        const { username } = result.data;

        const existingUsername = await UserModel.findOne({ username,isVerified: true });

        if (existingUsername) {
            return new Response(JSON.stringify({ success: false, message: "Username already exists" }), { status: 400 });
        } else {
            return new Response(JSON.stringify({ success: true, message: "Username is available" }), { status: 200 });
        }
        
    } catch (error) {
        console.error("Error parsing query parameters:", error);
        return new Response(JSON.stringify({ success: false, message: "Error Checking Username" }), { status: 500 });
    }
}