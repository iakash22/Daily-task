"use server"
import prisma from "@/lib/prisma";
import { wait } from "@/lib/wait";
import { createCollectionSchemaType } from "@/schema/createCollection";
import { currentUser } from "@clerk/nextjs";

export const createCollection = async(form : createCollectionSchemaType) => {
    const user = await currentUser();

    if(!user){
        throw new Error("User not found")
    };

    await wait(800);
    return await prisma.collection.create({
        data : {
            userId : user.id,
            color : form.color,
            name : form.name,
        }
    }) 
};

export const deleteCollection = async(id : number) => {
    const user = await currentUser();

    if(!user){
        throw new Error("User not found");
    }

    await wait(500)
    return await prisma.collection.delete({
        where : {
            id : id,
            userId : user.id,
        }
    })
};