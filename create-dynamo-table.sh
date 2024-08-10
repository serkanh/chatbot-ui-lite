#!/bin/sh

# Create DynamoDB table
awslocal dynamodb create-table \
  --table-name Conversations \
  --attribute-definitions AttributeName=sessionId,AttributeType=S \
  --key-schema AttributeName=sessionId,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1
echo "DynamoDB table created successfully."
