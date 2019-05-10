# AWS SAM API Gateway: A Sample Project

## AWS SAM
`SAM = Serverless Application Model​`

An open-source framework that you can use to build serverless applications on AWS​.

## Project Description
We want to build a Lambda function which will have some API endpoints and do some operations based on the method and parameters it sends. Lets consider we are going to build that for a simple advertising website.
Also let's assume our schema:​
* _itemId​_
* _itemName​_
* _itemDescription​_
* _itemLocation​_

​We'll have the following API endpoints:​
* /gateway/{itemId}, GET​
* /gateway, POST​
* /gateway/itemId, DELETE​
* /gateway/{itemId}, PUT​

Database: *AWS DynamoDB​*

## Project Setup
### Developer Environment
Get your developer environment ready! Follow the [guidelines][1].
Before you begin check the followings:
```
# check the aws sam cli version
sam --version  # supposed to show: SAM CLI, version 0.14.2
```
`0.14.2` is the latest version at the time of writing this document. Please update if you find another latest version.

### Clone the Repository and Install Dependencies
Open a terminal and do the followings:
```
git clone
cd sam-project-api-gateway
npm install
```

### Create A DynamoDB Table
To create a DynamoDB table, fill `bin/create_table.sh` with appropiate values and then run
```
sh bin/create_table.sh
```
### Import Some Data to your DynamoDB Table
Fill `bin/seed_data.sh` with appropiate values and then run:
```
sh bin/seed_data.sh
```
It will insert some data (seeds.json) into your newly created DynamoDB table. Go to AWS DynamoDB console to check if you can see the data has come through.

### Fill `template.yaml` with your specified environment variables
```
...
Environment:
  Variables:
    AWS_TABLE_NAME: YOUR_TABLE_NAME
    AWS_REGION: YOUR_AWS_REGION
    AWS_ENDPOINT: YOUR_AWS_ENDPOINT
...

E.g.,
Environment:
  Variables:
    AWS_TABLE_NAME: hafizItemTable
    AWS_REGION: ap-southeast-2
    AWS_ENDPOINT: http://dynamodb.ap-southeast-2.amazonaws.com
```
### Start the API
In your terminal, run:
```
sam local start-api
```
It will start your API and will be listening to http://127.0.0.1:3000. Please check the logs in your console to confirm. Some sample logs are shown:
```
2019-04-17 14:18:43 Found credentials in shared credentials file: ~/.aws/credentials
2019-04-17 14:18:43 Mounting gateway at http://127.0.0.1:3000/gateway/{itemId} [GET, DELETE, PUT, POST, HEAD, OPTIONS, PATCH]
2019-04-17 14:18:43 Mounting gateway at http://127.0.0.1:3000/gateway [POST]
2019-04-17 14:18:43 You can now browse to the above endpoints to invoke your functions. You do not need to restart/reload SAM CLI while working on your functions, changes will be reflected instantly/automatically. You only need to restart SAM CLI if you update your AWS SAM template
2019-04-17 14:18:43  * Running on http://127.0.0.1:3000/ (Press CTRL+C to quit)
2019-04-17 14:20:34 Invoking handler.gateway (nodejs8.10)

Fetching lambci/lambda:nodejs8.10 Docker container image......
2019-04-17 14:20:38 Mounting /home/hafizur/dev/hafiz_dev/aws-sam/sam-test-basic-project as /var/task:ro inside runtime container
```
Now you are ready to test the API endpoints.

## Test API endpoints
Use POSTMAN to test the endpoints.
### Examples
#### /gateway, POST
URL: `http://127.0.0.1:3000/gateway`
Method: POST
body:
```
{
  "itemName": "Nutri Bullet Grinder",
  "itemLocation": "Belmore, NSW",
  "itemDescription": "A near new nutri bulltet grinder for sale."
}
```
You supposed to see a response body similar to
```
{"itemId":"d17dceb0-6103-11e9-b623-d5ce8272ae05"}
```
#### /gateway, DELETE
URL: `http://127.0.0.1:3000/gateway/d17dceb0-6103-11e9-b623-d5ce8272ae05`
Method: DELETE
Response body:
```
"ITEM DELETED:d17dceb0-6103-11e9-b623-d5ce8272ae05"
```
The item having itemId=d17dceb0-6103-11e9-b623-d5ce8272ae05 is deleted.

## Deployment
### To package the project

```
aws cloudformation package --template-file template.yml --s3-bucket <name-of-the-bucket> --output-template-file packaged-template.yaml
```
### To deploy the project

```
aws --region <region> cloudformation deploy --template-file packaged-template.yaml --stack-name sam-test-basic-project --capabilities CAPABILITY_IAM
```

### To remove the stack from your account

```
aws --region <region> cloudformation delete-stack --stack-name sam-test-basic-project
```
