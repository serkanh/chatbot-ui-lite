import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { Message } from '../types';

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  endpoint: process.env.AWS_ENDPOINT,
});

export const saveMessages = async (sessionId: string, messages: Message[]) => {
  const params = {
    TableName: 'Conversations',
    Item: marshall({
      sessionId,
      messages,
      timestamp: new Date().toISOString(),
    }),
  };

  const command = new PutItemCommand(params);
  await dynamoDBClient.send(command);
};
