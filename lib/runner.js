'use strict';

const AWS = require("aws-sdk");
const fs = require('fs');
const uuidv1 = require('uuid/v1');
AWS.config.update({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT
});
console.log(`Importing ${process.env.AWS_TABLE_NAME} data into DynamoDB. Please wait...`);
var allItems = JSON.parse(fs.readFileSync('lib/seeds.json', 'utf8'));
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

const seed = async (allItems)=> {
  for (let i = 0, p = Promise.resolve(); i < allItems.length; i++) {
    p = p.then(_ => new Promise(resolve =>
        setTimeout(function () {
          var params = {
              TableName: process.env.AWS_TABLE_NAME,
              Item: {
                  "itemId": uuidv1(),
                  "itemName":  allItems[i].itemName,
                  "itemDescription": allItems[i].itemDescription,
                  "itemLocation":  allItems[i].itemLocation
              }
          };
          docClient.put(params, function(err, data) {
             if (err) {
                 console.error("Unable to add movie", allItems[i].itemName, ". Error JSON:", JSON.stringify(err, null, 2));
             } else {
                 console.log("PutItem succeeded:", allItems[i].itemName);
             }
          });
          resolve();
        }, 10)
    ));
  }
}

const seedItems = async () => {
  console.log('Seeding data');
  await seed(allItems);
};

seedItems()
  .then(() => console.log('Done!'))
  .catch(err => console.log(err));
