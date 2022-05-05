## Amazon API Gateway Pinpoint OTP Demo

## Requirements

- This package requires AWS Serverless Application Model (AWS SAM) Command Line Interface (CLI) to deploy to your account. Instructions for installing and setting up SAM CLI can be found here: https://aws.amazon.com/serverless/sam/
- This application requires an Amazon Pinpoint project to send SMS OTP messages. Follow the instructions to configure your project.
- Replace the `BRAND_NAME`, and `PINPOINT_APPLICATION_ID` in your template files before deployment.

## Deployment

- Once the above requirements are met, deploy the application using `sam deploy --guided`
- Optionally you can browse to the AWS Cloudformation console to view the resources in more detail

## Demo

- Make a `GET /`call without passing any headers. It should return with a `403` forbidden error.
- Next call the `POST /login` API and pass the `Phone` header with the recepient phone number. You should receive the OTP code as SMS.
- Next call the `POST /verify` API and pass the `Phone` and `Otp` headers. In the API response you should receive an API token.
- Lastly, call the `GET /` API again, and pass the `Authorization` header with the API token from previous step. You API call should return with a `200` response.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
