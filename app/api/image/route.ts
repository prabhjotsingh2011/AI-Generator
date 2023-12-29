
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';
import { increaseApiLimit,checkApiLimit } from '@/lib/api-limit';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);



export async function POST(req: Request) {
    try {
        const { userId } = auth()
        const body = await req.json()
        const { prompt,amount=1,resolution="512x512" } = body;

        console.log(userId)

        if (!userId) {
            return  new NextResponse("Unauthorized User",{status:401})
        }

        if (!configuration.apiKey) {
            return new NextResponse("Api key Not configured",{status:500})
        }

        if(!prompt) return new NextResponse("Prompt not entered",{status:400})
        if(!amount) return new NextResponse("Amount not entered",{status:400})
        if(!resolution) return new NextResponse("resolution not entered",{status:400})

        const freeTrail= await checkApiLimit();
        if(!freeTrail){
            return new NextResponse("Free trail has expired",{status:403})
        }
  
        await increaseApiLimit()


        const response = await openai.createImage({
            prompt,
            n:parseInt(amount,10),
            size:resolution
        })
        console.log("[IMAGE RESPONSE]", response)
        // const response = {
        //     data: {
        //         choices: [
        //             {message:"demo message"}
        //         ]
        //     }
        // }
        // return NextResponse.json( {role:"assistant",content:"demo message"})
        // {
        //     "role": "assistant",
        //     "content": "The average distance from the Earth to the Sun is about 93 million miles (150 million kilometers)."
        // }

        return NextResponse.json( "response.data.data")
    } catch (error) {
        console.log("[IMAGE ERROR]", error)
        return new NextResponse("Internal error",{ status:500})
    }
}