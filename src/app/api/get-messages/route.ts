import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authoptions } from "../auth/[...nextauth]/options";
import { getSession } from "next-auth/react";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authoptions)
    const user:User = await session?.user as User; // assertion

    if (!session || !session.user) {
        return Response.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const userId  = new mongoose.Types.ObjectId(user._id); // id is stored as a string, findbyid ect. will handle it by themselves but when aggregating we should be careful 
    try {
        const user = await UserModel.aggregate([
            {$match: {_id: userId}},
            {$unwind: "$messages"}, // unwind the messages array so we can filter them
            {$sort: {"messages.createdAt": -1}}, // sort messages by createdAt in descending order
            {$group: {_id: userId, messages: {$push: "$messages"}}}, // group back to user and collect messages

        ])

        if (!user || user.length === 0) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        
        return Response.json(
            { success: true, messages: user[0].messages },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching messages:", error);
        return Response.json(
            { success: false, message: "Failed to fetch messages" },
            { status: 500 }
        );
        
    }
}