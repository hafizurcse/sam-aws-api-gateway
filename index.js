'use strict';

const indexFunctions = require('./src/indexFunctions');

exports.handler = (event, context, callback) => {
	switch (event.httpMethod) {
		case 'DELETE':
			indexFunctions.deleteItem(event, callback);
			break;
		case 'GET':
			indexFunctions.getItem(event, callback);
			break;
		case 'POST':
			indexFunctions.saveItem(event, callback);
			break;
		case 'PUT':
			indexFunctions.updateItem(event, callback);
			break;
		default:
			indexFunctions.sendResponse(404, `Unsupported method "${event.httpMethod}"`, callback);
	}
};
