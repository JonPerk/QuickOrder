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
const uuidv4 = require('uuid/v4');

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
	this.attributes.order.number = uuidv4();
	this.emit(constants.speeches.WELCOME_SPEECH);
};

/** saves current order to database */
eventHandlers[constants.events.SAVE_ORDER] = function(){
	console.info('Event handler ' + constants.events.NEW_TWISTER + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	
	if(!this.handler.state){
		console.warn('WARNING Event handler ' + constants.events.NEW_TWISTER + ' state mismatch for ' + this.event.session.sessionId + ' Expected state: null Actual State: ' + this.handler.state);
		this.emit(constants.intents.UNHANDLED_INTENT);
		return;
	}
	
	if(this.handler.state !== constants.states.CONTINUE_MODE){
		console.warn('WARNING Event handler ' + constants.events.NEW_TWISTER + ' state mismatch for ' + this.event.session.sessionId + ' Expected state: null Actual State: ' + this.handler.state);
		this.emitWithState(constants.intents.UNHANDLED_INTENT);
		return;
	}
	
	let getTwister = function(context){
		twisterHelper.getNewTwister(context.attributes.completed, context.attributes.skipped).then(function(twister){
			if(twister){
				context.attributes.twister = twister;
				context.handler.state = constants.states.GAME_MODE;
				context.emitWithState(constants.speeches.SAY_TWISTER_SPEECH);
			} else {
				throw 'No tongue twisters found';
			}
		})
		.catch(function(err){
			console.error('ERROR GetNewTwister failed in event ' + constants.events.NEW_TWISTER + ' for ' + context.event.session.sessionId + ' State: ' + context.handler.state + ' Error: ' + err);
			context.emit(constants.speeches.FATAL_SPEECH);
		});
	};
	
	getTwister(this);
};

/** cancels current order i.e. doesn't save to database */
eventHandlers[constants.events.CANCEL_ORDER] = function(){
	console.info('Event handler ' + constants.events.VALIDATE_ATTEMPT + ' for ' + this.event.session.sessionId + ' State: ' + this.handler.state);
	if(!this.handler.state){
		console.warn('WARNING Event handler ' + constants.events.VALIDATE_ATTEMPT + ' state mismatch for ' + this.event.session.sessionId + ' Expected state: _GAME_MODE Actual State: ' + this.handler.state);
		this.emit(constants.intents.UNHANDLED_INTENT);
		return;
	}
	if(this.handler.state !== constants.states.GAME_MODE){
		console.warn('WARNING Event handler ' + constants.events.VALIDATE_ATTEMPT + ' state mismatch for ' + this.event.session.sessionId + ' Expected state: _GAME_MODE Actual State: ' + this.handler.state);
		this.emitWithState(constants.intents.UNHANDLED_INTENT);
		return;
	}
	if(!this.attributes.twister || !this.attributes.twister.value || (!this.attributes.twister.total && this.attributes.twister.total != 0)){
		console.error('ERROR Event handler ' + constants.events.VALIDATE_ATTEMPT + ' missing expected twister for ' + this.event.session.sessionId);
		this.emitWithState(constants.speeches.FATAL_SPEECH);
		return;
	}
	if(!this.event.request.intent.slots || !this.event.request.intent.slots.Twister || !this.event.request.intent.slots.Twister.value){
		this.handler.state = constants.states.REPEAT_MODE;
		this.emitWithState(constants.speeches.INCORRECT_SPEECH);
		return;
	}
	
	let expected = this.attributes.twister.value.replace(/[^a-zA-z0-9]/g, "").toLowerCase();
	let attempt = this.event.request.intent.slots.Twister.value.replace(/[^a-zA-z0-9]/g, "").toLowerCase();
	
	//debug
	//console.info("Expected: " + expected + " Actual attempt: " + attempt + " Match? " + (attempt === expected));
	if(attempt === expected){
		this.attributes.score++;
		
		if(this.attributes.score >= this.attributes.twister.total){
			this.emitWithState(constants.speeches.WIN_SPEECH);
		} else {
			if(!this.attributes.completed){
				this.attributes.completed = [];
			}
			if(!this.attributes.skipped){
				this.attributes.skipped = [];
			}
			let index = this.attributes.skipped.indexOf(this.attributes.twister.index);
			
			if(index > -1){
				this.attributes.skipped.splice(index,1);
			}
			
			this.attributes.completed.push(this.attributes.twister.index);
			this.handler.state = constants.states.CONTINUE_MODE;
			this.attributes.twister = null;
			this.emitWithState(constants.speeches.CORRECT_SPEECH);
		}
	} else {
		this.attributes.attempt = this.event.request.intent.slots.Twister.value;
		this.handler.state = constants.states.REPEAT_MODE;
		this.emitWithState(constants.speeches.INCORRECT_SPEECH);
	}
};

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

let gameMode = Object.assign({}, eventHandlers);
let repeatMode = Object.assign({}, eventHandlers);
let continueMode = Object.assign({}, eventHandlers);
 
module.exports = {
	statelessHandlers : eventHandlers,
	gameModeHandlers : Alexa.CreateStateHandler(constants.states.GAME_MODE, gameMode),
	repeatModeHandlers : Alexa.CreateStateHandler(constants.states.REPEAT_MODE, repeatMode),
	continueModeHandlers : Alexa.CreateStateHandler(constants.states.CONTINUE_MODE, continueMode)	
};
