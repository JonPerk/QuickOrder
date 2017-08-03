const AWS = require('aws-sdk');
const config = require('./configuration');
const constants = require('./constants');

AWS.config.update({
  region: config.dbRegion
});

const sns = new AWS.SNS();

const snsHelper = {
	sendSaveOrderMessage : function(orderNumber){
		return new Promise(function(resolve, reject){
			let endpoint = config.webappEndpoint;// + '/order/' + orderNumber;
			let message = {
					default: constants.notifications.SAVE_MESSAGE_LONG.replace('%s', endpoint),
					email: constants.notifications.SAVE_MESSAGE_LONG.replace('%s', endpoint),
					sms: constants.notifications.SAVE_MESSAGE_SHORT.replace('%s', endpoint),
			};
			let messageStr = JSON.stringify(message);
	        const params = {
				MessageStructure: 'json',
				Message: messageStr, /* required */
				Subject: constants.notifications.SAVE_MESSAGE_SUBJECT,
				/*MessageAttributes: {
					'<String>': {
						DataType: 'STRING_VALUE', /* required * /
						BinaryValue: new Buffer('...') || 'STRING_VALUE',
						StringValue: 'STRING_VALUE'
					},
					/* '<String>': ... * /
				},*/
				TopicArn: config.saveMessageTopic
			};
			sns.publish(params, function(err, data) {
				if (err) {
					console.error("Publish save message error ", err, err.stack);
					reject(err);
				}
				else {
					console.info("Publish save message success ", data);
					resolve(data);
				}
			});
		});
	}
}

module.exports = snsHelper;