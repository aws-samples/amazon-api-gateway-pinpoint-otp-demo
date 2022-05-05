// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

exports.handler = async(event) => {
  return {
    "status": "200",
    "body": "This response is from an authenticated API."
  }
}
