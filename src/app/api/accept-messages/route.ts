import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authoptions } from "../auth/[...nextauth]/options";


export async function POST(request: Request) {
    await dbConnect;

    const session = await getServerSession(authoptions);
    const user: User = await session?.user as User; //assertion

    if (!session || !session.user){
        return Response.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        )
    }

    const userId = user._id;
    const {acceptMessages} = await request.json();
    
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        )
        if (!updatedUser) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        return Response.json(
            { success: true, message: "User status updated successfully", user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to update user status to accept messages", error);
        return Response.json(
            { success: false, message: "Failed to update user status to accept messages" },
            { status: 500 }
        );
        
    }
}

export async function  GET(request: Request) {
    await dbConnect();

    const session =  await getServerSession(authoptions)
    const user:User = await session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        )
    }

    const userId = user._id;

    try {
        const userStatus = await UserModel.findById(userId, "isAcceptingMessages");

        if (!userStatus) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, isAcceptingMessages: userStatus.isAcceptingMessages },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to fetch user status", error);
        return Response.json(
            { success: false, message: "Failed to fetch user status" },
            { status: 500 }
        );
        
    }

}