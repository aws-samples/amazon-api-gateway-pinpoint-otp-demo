// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require("aws-sdk");
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event) => {

  if (!event.headers.hasOwnProperty('authorization')) {
    return {
      isAuthorized: false
    }
  }

  let response = await client.get({
    TableName: process.env.TABLE_NAME,
    Key: {
      "SessionID": event.headers.authorization
    }
  }).promise();
  if (response.hasOwnProperty('Item')) {
    return {
      isAuthorized: true
    }
  }
  return {
    isAuthorized: false
  }
};
