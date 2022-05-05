// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require("aws-sdk");
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event) => {
  // If an authorization header is not passed, the request is not authorized.
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
  // If a valid SessionID is present, the request is authorized.
  if (response.hasOwnProperty('Item')) {
    return {
      isAuthorized: true
    }
  }
  return {
    isAuthorized: false
  }
};
