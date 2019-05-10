'use strict';

const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT
});

let dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.AWS_TABLE_NAME;

module.exports.initializateDynamoClient = newDynamo => {
	dynamo = newDynamo;
};

module.exports.saveItem = item => {
  const params = {
    TableName: tableName,
    Item: item
  };
  return dynamo
  	.put(params)
  	.promise()
  	.then(() => {
  		return item.itemId;
  	}).catch(err => {
      return err;
    });
};

module.exports.getItem = itemId => {
	const params = {
		Key: {
			itemId: itemId
		},
		TableName: tableName
	};

	return dynamo
		.get(params)
		.promise()
		.then(result => {
			return result.Item;
		});
};

module.exports.deleteItem = itemId => {
	const params = {
		Key: {
			itemId: itemId
		},
		TableName: tableName
	};

	return dynamo.delete(params).promise();
};

module.exports.updateItem = (itemId, paramsName, paramsValue) => {
	const params = {
		TableName: tableName,
		Key: {
			itemId
		},
		ConditionExpression: 'attribute_exists(itemId)',
		UpdateExpression: 'set ' + paramsName + ' = :v',
		ExpressionAttributeValues: {
			':v': paramsValue
		},
		ReturnValues: 'ALL_NEW'
	};

	return dynamo
		.update(params)
		.promise()
		.then(response => {
			return response.Attributes;
		});
};
