/**
 * @file ./dbHelper.js
 * @copyright Jon Perkowski 2017
 */

/**
 * Interacts with backend database
 * @module dbHelper
 *
 */

const AWS = require('aws-sdk');
const config = require('./configuration');

AWS.config.update({
  region: config.dbRegion
});

const docClient = new AWS.DynamoDB.DocumentClient();

/** reads products from database, writes orders */
const dbHelper = {
	saveOrder : function(order){
		console.info("Save order for " + JSON.stringify(order, null, 2));
		return new Promise(function(resolve, reject){
			let params = {
				TableName: 'orderdetail',
				Item: order
			}
			
			docClient.put(params, function(err, data) {
			    if (err) {
			        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
			        reject(err);
			    } else {
			    	console.info("Added item:", JSON.stringify(data, null, 2));
			        resolve(data);
			    }
			});
		});
	},
	getProduct : function(productName){
		console.info("Get product for " + productName);
		return new Promise(function(resolve, reject){
			let params = {
			    TableName: 'productdetails',
			    Key:{
			        "prodname": productName
			    }
			};

			docClient.get(params, function(err, data) {
			    if (err) {
			        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
			        reject(err);
			    } else {
			    	console.info("GetItem succeeded:", JSON.stringify(data, null, 2));
			        resolve(data.Item);
			    }
			});
		});
	}
};

module.exports = dbHelper;