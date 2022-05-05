// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require("aws-sdk");
const pinpoint = new AWS.Pinpoint();
const dynamo = new AWS.DynamoDB.DocumentClient();
const crypto = require('crypto');
const { Agent } = require("http");

exports.handler = async(event) => {
  let reference = process.env.BRAND_NAME + 'CreateAccount' + event.headers.phone;
  let params = {
    ApplicationId: process.env.PINPOINT_APPLICATION_ID,
    VerifyOTPMessageRequestParameters: {
      DestinationIdentity: event.headers.phone,                               // Phone number that received the OTP
      Otp: event.headers.otp,                                                 // OTP entered by user
      ReferenceId: crypto.createHash('md5').update(reference).digest('hex')   // Unique identifier. Should be same as used while sending OTP
    }
  };
  // Verify the OTP
  let response = await pinpoint.verifyOTPMessage(params).promise();
  if (response.VerificationResponse.Valid != true) {
    return {
      "status": 400,
      "message": "Invalid otp"
    }
  }
  // Create a session, and store it in DynamoDB table
  params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      SessionID: crypto.createHash('md5').update(event.headers.phone + Math.floor(Date.now() / 1000)).digest('hex'),
      Phone: event.headers.phone,
      Device: event.headers['user-agent'],
      CreatedAt: Math.floor(Date.now() / 1000),
      ExpiresAt: Math.floor(Date.now() / 1000) + 604800
    }
  };
  response = await dynamo.put(params).promise();
  if (response != null) {
    return {
      'status': 201,
      'message': 'Access key created',
      'key': params.Item.SessionID        // For demo, Session ID is used as the API key
    }
  }

  return {
    'status': 400,
    'message': 'Could not create access keys'
  }
};
