import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';
import { date } from 'zod/v4-mini';


export async function POST(request:Request){x
    await dbConnect();
    try {
        const {username,email,password} = await request.json()
        const existingUserVerifiedByUsername = await  UserModel.findOne({username,isVerified:true})
        if (existingUserVerifiedByUsername) {
            return new Response(JSON.stringify({success:false,message:"Username already exists"}),{status:400})
        }
        const existingUserVerifiedByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); 
        if (existingUserVerifiedByEmail) {
            if(existingUserVerifiedByEmail.isVerified){
                return new Response(JSON.stringify({success:false,message:"Email already exists"}),{status:400});
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1); 
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpires = expiryDate;
                existingUserVerifiedByEmail.isVerified = false;
                await existingUserVerifiedByEmail.save();
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1); 
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpires: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })
            await newUser.save();

            //send verification email
            const emailResponse = await sendVerificationEmail(username,email,verifyCode);

            if (!emailResponse.success) {
                return new Response(JSON.stringify({success:false,message:emailResponse.message}),{status:500});
            }
            return new Response(JSON.stringify({success:true,message:"User Registered Successfully. Please Verify Your Email"}),{status:201});
        
        }
    } catch (error) {
        console.error("Error in sign-up route:", error);
        return new Response(JSON.stringify({success:false,message:"Error registering user"}),{status:500});
    }
}