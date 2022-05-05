// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require("aws-sdk");
const pinpoint = new AWS.Pinpoint();
const crypto = require('crypto');

exports.handler = async(event) => {
  let reference = process.env.BRAND_NAME + 'CreateAccount' + event.headers.phone;
  let params = {
    ApplicationId: process.env.PINPOINT_APPLICATION_ID,
    SendOTPMessageRequestParameters: {
      BrandName: process.env.BRAND_NAME,
      Channel: 'SMS',
      DestinationIdentity: event.headers.phone,
      OriginationIdentity: 'TEST',
      ReferenceId: crypto.createHash('md5').update(reference).digest('hex'),
      AllowedAttempts: '3',
      CodeLength: '6',
    }
  };

  let response = await pinpoint.sendOTPMessage(params).promise();
  if (response.MessageResponse.Result[event.headers.phone].DeliveryStatus == 'SUCCESSFUL') {
    return {
      'status': 200,
      'message': 'OTP sent successfully'
    }
  }

  return {
      'status': 400,
      'message': 'Not sent'
  }
};
