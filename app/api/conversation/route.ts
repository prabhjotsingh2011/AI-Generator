
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);



export async function POST(req: Request) {
    try {
        const { userId } = auth()
        const body = await req.json()
        const { message } = body;

        if (!userId) {
            return  new NextResponse("Unauthorized User",{status:401})
        }

        if (!configuration.apiKey) {
            return new NextResponse("Api key Not configured",{status:500})
        }

        if(!message) return new NextResponse("Message not entered",{status:400})

        // const response = await openai.createChatCompletion({
        //     model: "gpt-3.5-turbo",
        //     messages:message
        // })
        const response = {
            data: {
                choices: [
                    {message:"demo message"}
                ]
            }
        }
        return NextResponse.json( {role:"assistant",content:"demo message"})
        // {
        //     "role": "assistant",
        //     "content": "The average distance from the Earth to the Sun is about 93 million miles (150 million kilometers)."
        // }

        // return NextResponse.json( response.data.choices[0].message)
    } catch (error) {
        console.log("[CONVERSATION ERROR]", error)
        return new NextResponse("Internal error",{ status:500})
    }
}