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
      BrandName: process.env.BRAND_NAME,                                      // Company/product name that is sending the OTP. Mandatory in some countries
      Channel: 'SMS',
      DestinationIdentity: event.headers.phone,                               // Phone number which receives the OTP
      OriginationIdentity: 'TEST',                                            // From phone number or SenderID
      ReferenceId: crypto.createHash('md5').update(reference).digest('hex'),  // Unique identifier to ensure send/verify match
      AllowedAttempts: '3',                                                   // Max retries allowed when verifying OTP
      CodeLength: '6',                                                        // Length of OTP code
    }
  };
  // Calls the Pinpoint API to send a OTP message with the parameters defined above.
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
