'use strict';

var AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : process.env.AWS_TABLE_NAME,
    KeySchema: [
        { AttributeName: process.env.AWS_TABLE_ATTRIBUTE, KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: process.env.AWS_TABLE_ATTRIBUTE, AttributeType: "S" },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
