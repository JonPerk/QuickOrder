/**
 * @file ./dbHelper.js
 * @copyright Jon Perkowski 2017
 */

/**
 * Interacts with backend database
 * @module dbHelper
 *
 */

/** gets new twisters. Omits completed and skipped ones. 
 * If completed + skipped = total number of twister then skipped are reused.
 * If all twisters are completed undefined is returned */
var dbHelper = {
	saveOrder : function(order){
		return new Promise(function(resolve, reject){
			reject({'error':'not yet implemented'});
		});
	},
	getProduct : function(productName){
		return new Promise(function(resolve, reject){
			reject({'error':'not yet implemented'});
		});
	}
};

module.exports = dbHelper;