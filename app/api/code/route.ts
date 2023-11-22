import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const instructionMessage: ChatCompletionRequestMessage = {
  role: "system",
  content:
    "you are the code generator and you are only allowed to answer the questions in markdown code snippets. Use code commments and explanations. Do not answer the question if its not related to coding, in that case return an appology message that please ask me question of coding only as i am a code generator",
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { message } = body;

    if (!userId) {
      return new NextResponse("Unauthorized User", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("Api key Not configured", { status: 500 });
    }

    if (!message)
      return new NextResponse("Message not entered", { status: 400 });

    // const response = await openai.createChatCompletion({
    //     model: "gpt-3.5-turbo",
    //     messages:[instructionMessage,...message]
    // })
    // return NextResponse.json( response.data.choices[0].message)

      
    return NextResponse.json({ role: "assistant", content: "Coding demo message" });
  } catch (error) {
    console.log("[CONVERSATION ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
