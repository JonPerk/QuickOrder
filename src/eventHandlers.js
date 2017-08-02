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
	console.info('Event handler ' + constants.events.ADD_PRODUCT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	
	if(this.handler.state){
		console.warn('WARNING Event handler ' + constants.events.ADD_PRODUCT + ' state mismatch for ' + this.event.session.sessionId + ' Expected state: null Actual State: ' + this.handler.state);
		this.emitWithState(constants.intents.UNHANDLED_INTENT);
		return;
	}
	
	let currentProduct = this.attributes.currentProduct;
	let productName;
	if(this.event.request.intent.slots && this.event.request.intent.slots.Product){
		productName = this.event.request.intent.slots.Product.value;
	}
	let quantity;
	if(this.event.request.intent.slots && this.event.request.intent.slots.Quantity && !isNaN(this.event.request.intent.slots.Quantity.value)){
		quantity = Number(this.event.request.intent.slots.Quantity.value);
	}
	if(!productName && !quantity){
		this.emit(constants.intents.UNHANDLED_INTENT);
		return;
	}
	if(!currentProduct){
		if(!productName){
			this.attributes.currentProduct = {};
			this.attributes.currentProduct.quantity = quantity;
			this.emit(constants.speeches.QUANTITY_STARTED_SPEECH);
		} else if(!quantity) {
			let productSearch = function(context, productName){
				dbHelper.getProduct(productName)
				.then(function(product){
					context.attributes.currentProduct = product;
					context.emit(constants.speeches.PRODUCT_STARTED_SPEECH);
				})
				.catch(function(err){
					console.info('ProductNotFound in EventHandler ' + constants.events.ADD_PRODUCT + ' for ' + this.event.session.sessionId + ' product search name ' + productName + " error " + err);
					context.emit(constants.speeches.PRODUCT_NOT_FOUND_SPEECH);
				});
			};
			
			productSearch(this, productName);
		} else {
			let productSearch = function(context, productName, quantity){
				dbHelper.getProduct(productName)
				.then(function(product){
					product.quantity = quantity;
					context.attributes.order.products.push(product);
					context.attributes.currentProduct = null;
					context.emit(constants.speeches.PRODUCT_ADDED_SPEECH);
				})
				.catch(function(err){
					console.info('ProductNotFound in EventHandler ' + constants.events.ADD_PRODUCT + ' for ' + context.event.session.sessionId + ' product search name ' + productName + " error " + err);
					context.emit(constants.speeches.PRODUCT_NOT_FOUND_SPEECH);
				});
			};
			
			productSearch(this, productName, quantity);
		}
	} else if(!currentProduct.name){
		if(!productName){
			this.emit(constants.speeches.QUANTITY_IN_PROGRESS_SPEECH);
		} else if(!quantity) {
			let productSearch = function(context, productName, quantity){
				dbHelper.getProduct(productName)
				.then(function(product){
					product.quantity = quantity;
					context.attributes.order.products.push(product);
					context.attributes.currentProduct = null;
					context.emit(constants.speeches.PRODUCT_ADDED_SPEECH);
				})
				.catch(function(err){
					console.warn('ProductNotFound in EventHandler ' + constants.events.ADD_PRODUCT + ' for ' + context.event.session.sessionId + ' product search name ' + productName + " error " + err);
					context.emit(constants.speeches.PRODUCT_NOT_FOUND_SPEECH);
				});
			};
			
			productSearch(this, productName, currentProduct.quantity);
		} else {
			this.emit(constants.speeches.QUANTITY_IN_PROGRESS_SPEECH);
		}
	} else {
		if(!productName){
			let product = currentProduct;
			product.quantity = quantity;
			this.attributes.order.products.push(product);
			this.attributes.currentProduct = null;
			this.emit(constants.speeches.PRODUCT_ADDED_SPEECH);
		} else if(!quantity) {
			this.emit(constants.speeches.PRODUCT_IN_PROGRESS_SPEECH);
		} else {
			this.emit(constants.speeches.PRODUCT_IN_PROGRESS_SPEECH);
		}
	}
};

let finishMode = Object.assign({}, eventHandlers);
let cancelMode = Object.assign({}, eventHandlers);
 
module.exports = {
	statelessHandlers : eventHandlers,
	finishModeHandlers : Alexa.CreateStateHandler(constants.states.FINISH_MODE, finishMode),
	cancelModeHandlers : Alexa.CreateStateHandler(constants.states.CANCEL_MODE, cancelMode)
};
