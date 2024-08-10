import AWS from 'aws-sdk';
import { Message } from '../types';

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.AWS_ENDPOINT,
});

export const saveMessages = async (sessionId: string, messages: Message[]) => {
  const params = {
    TableName: 'Conversations',
    Item: {
      sessionId,
      messages,
      timestamp: new Date().toISOString(),
    },
  };

  await dynamoDB.put(params).promise();
};
