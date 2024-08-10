import { Message } from "@/types";
import { OpenAIStream } from "@/utils";
import { connectToDatabase } from "@/utils/db";

export const config = {
  runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { messages, sessionId } = (await req.json()) as {
      messages: Message[];
      sessionId: string;
    };

    const charLimit = 12000;
    let charCount = 0;
    let messagesToSend = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (charCount + message.content.length > charLimit) {
        break;
      }
      charCount += message.content.length;
      messagesToSend.push(message);
    }

    const stream = await OpenAIStream(messagesToSend);

    // Store messages in the database
    console.log("Storing messages in the database",messagesToSend);
    console.log("Session ID",sessionId);
    // const db = await connectToDatabase();
    // await db.collection("conversations").insertOne({
    //   sessionId,
    //   messages: messagesToSend,
    //   timestamp: new Date()
    // });

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
