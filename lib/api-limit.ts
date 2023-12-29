import {auth} from '@clerk/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import prismadb from '@/lib/prismadb';

import { MAX_FREE_COUNTS } from '@/constants';

export const increaseApiLimit = async () => {
    const {userId}= auth();
    if(!userId) return ;


    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where:{
            userId
        }
    })

    if(userApiLimit){
        await prismadb.userApiLimit.update({
            where:{userId:userId},
            data:{
                count: userApiLimit.count+1
            }
        })
    }
    else{
        await prismadb.userApiLimit.create({
            data:{
                userId,
                count: 1,
            }
        })
    }
}

export const checkApiLimit = async () => {
    const {userId}= auth();
    if(!userId) return false;

    const userApiLimit:any = await prismadb.userApiLimit.findUnique({
        where:{
            userId
        }
    })

    if(userApiLimit && userApiLimit?.count < MAX_FREE_COUNTS){
        return true;
    }
    else{
        // return res.status(200).json({message: 'Authorized'});
        return false
    }
}