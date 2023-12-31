
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';
import Replicate from "replicate"
import { increaseApiLimit,checkApiLimit } from '@/lib/api-limit';


const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
})

export async function POST(req: Request) {
    try {
        const { userId } = auth()
        const body = await req.json()
        const { prompt } = body;

        if (!userId) {
            return new NextResponse("Unauthorized User", { status: 401 })
        }

        if (!prompt) {
            return new NextResponse("Prompt missing", { status: 500 })
        }


        const freeTrail = await checkApiLimit();
        
        if (!freeTrail) {
            return new NextResponse("Free trail has expired", { status: 403 })
        }

        const response = await replicate.run(
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            {
                input: {
                    prompt: prompt,

                }
            }
        );
        await increaseApiLimit()

        return NextResponse.json(response)
    } catch (error: any) {
        console.log("[VIDEO ERROR]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}