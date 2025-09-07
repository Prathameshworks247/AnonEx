import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";


export async function POST(request:Request){
    await dbConnect;

    const {username, message} = await request.json();

    try {
        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        if (!user.isAcceptingMessages){
            return Response.json(
                { success: false, message: "User is not accepting messages" },
                { status: 403 }
            );
        }
        const newMessage ={
            content: message,
            createdAt: new Date(),
        }

        user.messages.push(newMessage as Message);

        await user.save()

        return Response.json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        }, { status: 200
        })
        
    } catch (error) {
        console.error("Error sending message:", error);
        return Response.json(
            { success: false, message: "Failed to send message" },
            { status: 500 }
        );
        
    }
}
