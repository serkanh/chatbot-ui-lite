import { Message } from "@/types";
import { OpenAIStream } from "@/utils";

export const config = {
  runtime: "edge",
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

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

    // Call the API route to save messages to DynamoDB
    const response = await fetch(`${baseUrl}/api/saveMessages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId, messages: messagesToSend }),
    });

    if (!response.ok) {
      console.error("Failed to save messages to DynamoDB");
      throw new Error("Failed to save messages");
    }

    const result = await response.json();

    if (result.error) {
      console.error("Error saving messages to DynamoDB:", result.error);
      throw new Error("Failed to save messages");
    }

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
