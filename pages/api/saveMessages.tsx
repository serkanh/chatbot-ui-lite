import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  endpoint: process.env.AWS_ENDPOINT,
});

const saveMessagesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { sessionId, messages } = req.body;

  const params = {
    TableName: 'Conversations',
    Item: marshall({
      sessionId,
      messages,
      timestamp: new Date().toISOString(),
    }),
  };

  try {
    const command = new PutItemCommand(params);
    await dynamoDBClient.send(command);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error saving messages:", error);

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export default saveMessagesHandler;
