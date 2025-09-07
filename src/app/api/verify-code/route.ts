import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();

    try {
        const {username,code} = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername});

        if (!user) {
            return new Response(JSON.stringify({ success: false, message: "Invalid Username" }), { status: 400 });
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpires) > new Date();

        if (isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return new Response(JSON.stringify({ success: true, message: "User verified successfully" }), { status: 200 });
        }
        else if (!isCodeNotExpired) {
            return new Response(JSON.stringify({ success: false, message: "Verification code expired please sign up to get new code" }), { status: 400 });
        }
        else {
            return new Response(JSON.stringify({ success: false, message: "Invalid verification code" }), { status: 400 });
        }
            

    } catch (error) {
        console.error("Error in verify code route:", error);
        return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), { status: 500 });
    }
}