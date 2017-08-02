/**
 * @file ./eventHandlers.js
 * @copyright Jon Perkowski 2017
 */

/**
 * Handles main logic of QuickOrder
 * @module eventHandlers
 *
 */

const Alexa = require('alexa-sdk');
const constants = require('./constants');
const uuidHelper = require('./uuidHelper');
const dbHelper = require('./dbHelper');

let eventHandlers = {};

/** creates new session, initializes attributes */
eventHandlers[constants.events.NEW_SESSION] = function(){
	console.info('Event handler ' + constants.events.NEW_SESSION + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	
	if(this.handler.state){
		console.warn('WARNING Event handler ' + constants.events.NEW_SESSION + ' state mismatch for ' + this.event.session.sessionId + ' Expected state: null Actual State: ' + this.handler.state);
		this.emitWithState(constants.intents.UNHANDLED_INTENT);
		return;
	}
	
	this.attributes.order = {};
	this.attributes.order.products = [];
	this.attributes.order.number = uuidHelper.getUUID();
	this.emit(constants.speeches.WELCOME_SPEECH);
};

/** saves current order to database */
eventHandlers[constants.events.SAVE_ORDER] = function(){
	console.info('Event handler ' + constants.events.SAVE_ORDER + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	if(!this.handler.state){
		console.warn('WARNING Event handler ' + constants.events.NEW_SESSION + ' state mismatch for ' + this.event.session.sessionId + ' Expected state: _FINISH_MODE Actual State: ' + this.handler.state);
		this.emit(constants.intents.UNHANDLED_INTENT);
		return;
	}
	if(this.handler.state !== constants.states.FINISH_MODE){
		console.warn('WARNING Event handler ' + constants.events.NEW_SESSION + ' state mismatch for ' + this.event.session.sessionId + ' Expected state: _FINISH_MODE Actual State: ' + this.handler.state);
		this.emitWithState(constants.intents.UNHANDLED_INTENT);
		return;
	}
	if(!this.attributes.order || !this.attributes.order.products || this.attributes.order.products.length < 1){
		this.handler.state = null;
		this.emit(constants.speeches.NO_PRODUCTS_SPEECH);
		return;
	}
	
	let save = function(context){
		dbHelper.saveOrder(context.attributes.order)
		.then(function(){
			console.log("ORDER SAVED");
			context.emitWithState(constants.speeches.ORDER_SAVED_SPEECH);
		})
		.catch(function(err){
			if(typeof err === 'object' && err !== null){
				console.error('Event handler ' + constants.events.SAVE_ORDER + ' for ' + context.event.session.sessionId + ' failed on backend database call: ' + JSON.stringify(err));
			} else {
				console.error('Event handler ' + constants.events.SAVE_ORDER + ' for ' + context.event.session.sessionId + ' failed on backend database call: ' + err);
			}
			context.emitWithState(constants.speeches.ERROR_SPEECH);
		});
	};
	
	save(this);
};

/** determines if user wishes to cancel the currentProduct or entire order */
eventHandlers[constants.events.CANCEL_EVENT] = function(){
	console.info('Event handler ' + constants.events.CANCEL_EVENT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	if(this.handler.state){
		this.emitWithState(constants.speeches.UNHANDLED_SPEECH);
	}
	
	if(this.attributes.currentProduct){
		this.attributes.currentProduct = null;
		this.emit(constants.speeches.PRODUCT_REMOVED_SPEECH);
	} else {
		this.emit(constants.speeches.CANCEL_ORDER_SPEECH);
	}
}

/** cancels current order i.e. doesn't save to database */
eventHandlers[constants.events.CANCEL_ORDER] = function(){
	console.info('Event handler ' + constants.events.CANCEL_ORDER + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.attributes.currentProduct = null;
	this.attributes.order = null;
	if(!this.handler.state){
		this.emit(constants.speeches.ORDER_CANCELLED_SPEECH);
	} else {
		this.emitWithState(constants.speeches.ORDER_CANCELLED_SPEECH);
	}
};


/** resets state and allow user to continue with order */
eventHandlers[constants.events.CONTINUE_ORDER] = function(){
	console.info('Event handler ' + constants.events.CONTINUE_ORDER + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	this.handler.state = null;
	this.emit(constants.speeches.CONTINUE_ORDER_SPEECH);
}

/** adds product to order, 
 * changes state to ADD_QUANTITY_MODE if not provided
 * changes state to ADD_PRODUCT_MODE if not provided */
eventHandlers[constants.events.ADD_PRODUCT] = function(){
	console.info('Event handler ' + constants.events.HELP_TWISTER + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	
	if(this.handler.state){
		console.warn('WARNING Event handler ' + constants.events.HELP_TWISTER + ' state mismatch for ' + this.event.session.sessionId + ' Expected state: null Actual State: ' + this.handler.state);
		this.emitWithState(constants.intents.UNHANDLED_INTENT);
		return;
	}
	
	this.handler.state = constants.states.GAME_MODE;
	
	/*if(!this.attributes.twister || !this.attributes.twister.value || (!this.attributes.twister.total && this.attributes.twister.total != 0)){
		let getTwister = function(context){
			twisterHelper.getNewTwister(context.attributes.completed, context.attributes.skipped).then(function(twister){
				if(twister){
					context.attributes.twister = twister;
					context.emitWithState(constants.speeches.HELP_SPEECH);
				} else {
					throw 'No tongue twisters found';
				}
			})
			.catch(function(err){
				console.error('ERROR GetNewTwister failed in event ' + constants.events.HELP_TWISTER + ' for ' + context.event.session.sessionId + ' State: ' + context.handler.state + ' Error: ' + err);
				context.emitWithState(constants.speeches.FATAL_SPEECH);
			});
		};
		
		getTwister(this);
	} else {
		this.emitWithState(constants.speeches.HELP_SPEECH);
	}*/
};

let finishMode = Object.assign({}, eventHandlers);
let cancelMode = Object.assign({}, eventHandlers);
 
module.exports = {
	statelessHandlers : eventHandlers,
	finishModeHandlers : Alexa.CreateStateHandler(constants.states.FINISH_MODE, finishMode),
	cancelModeHandlers : Alexa.CreateStateHandler(constants.states.CANCEL_MODE, cancelMode)
};
