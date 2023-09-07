"use server";

import prisma from "@/lib/prisma";
import { createTaskSchemaType } from "@/schema/createTask"
import { currentUser } from "@clerk/nextjs"

export const createTask = async(data : createTaskSchemaType) => {
    const user = await currentUser();

    if(!user){
        throw new Error("User not found");
    }

    return await prisma.task.create({
        data : {
            userId : user?.id,
            content : data.content,
            expiresAt : data.expiresAt,
            collection : {
                connect : {
                    id : data.collectionId
                }
            }
        }
    })
};

export async function setTaskToDone(id: number) {
    const user = await currentUser();

    if (!user) {
        throw new Error("user not found")
    } 

    return await prisma.task.update({
        where: {
            id: id,
            userId: user.id
        },
        data: {
            done: true
        }
    })
}