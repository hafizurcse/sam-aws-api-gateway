const databaseManager = require('./databaseManager');
const uuidv1 = require('uuid/v1');
const functions = {
  'deleteItem': null,
  'getItem': null,
  'saveItem': null,
  'updateItem': null,
  'sendResponse': null
};

functions.deleteItem = function(event, callback) {
  const itemId = event.pathParameters.itemId;

	databaseManager.deleteItem(itemId).then(response => {
		functions.sendResponse(200, `ITEM DELETED:${itemId}`, callback);
	});
}

functions.saveItem = function(event, callback) {
  const item = JSON.parse(event.body);
	item.itemId = uuidv1();

	databaseManager.saveItem(item).then(response => {
		console.log(response);
		functions.sendResponse(200, {'itemId': item.itemId}, callback);
	}).catch(err => {
		console.log('Error in saving the item ', err);
	});
}

functions.getItem = function(event, callback) {
  const itemId = event.pathParameters.itemId;

	databaseManager.getItem(itemId).then(response => {
		console.log(response);
		sendResponse(200, JSON.stringify(response), callback);
	});
}

functions.updateItem = function(event, callback) {
	const itemId = event.pathParameters.itemId;

	const body = JSON.parse(event.body);
	const paramName = body.paramName;
	const paramValue = body.paramValue;

	databaseManager.updateItem(itemId, paramName, paramValue).then(response => {
		console.log(response);
		sendResponse(200, JSON.stringify(response), callback);
	});
}

functions.sendResponse = function(statusCode, message, callback) {
	const response = {
		statusCode: statusCode,
		body: JSON.stringify(message)
	};
	callback(null, response);
}
module.exports = functions;
