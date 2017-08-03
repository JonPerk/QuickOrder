const index = require('../../src/index'),
	cancelModeHandlers = require('../../src/cancelModeHandlers'),
	finishModeHandlers = require('../../src/finishModeHandlers'),
	statelessHandlers = require('../../src/statelessHandlers'),
	eventHandlers = require('../../src/eventHandlers'),
	speechHandlers = require('../../src/speechHandlers'),
	uuidHelper = require('../../src/uuidHelper'),
	dbHelper = require('../../src/dbHelper'),
	snsHelper = require('../../src/snsHelper');
let context = require('aws-lambda-mock-context'),
	tests = require('../json/index');

tests = tests.eventHandlers;

describe('eventHandlers', function() {
	let i = 0;
	let response;
	let error;
	
	it('testNewSession', function(done) {
		execute('testNewSession').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testNewSessionBadState', function(done) {
		execute('testNewSessionBadState').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testSaveOrder', function(done) {
		execute('testSaveOrder').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testSaveOrderStateless', function(done) {
		execute('testSaveOrderStateless').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testSaveOrderWrongState', function(done) {
		execute('testSaveOrderWrongState').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testSaveOrderNoOrder', function(done) {
		execute('testSaveOrderNoOrder').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testSaveOrderNoProducts', function(done) {
		execute('testSaveOrderNoProducts').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testSaveOrderBackendFail', function(done) {
		execute('testSaveOrderBackendFail').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testCancelOrderStateless', function(done) {
		execute('testCancelOrderStateless').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testCancelOrder', function(done) {
		execute('testCancelOrder').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testCancelEventWithProduct', function(done) {
		execute('testCancelEventWithProduct').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testCancelEventNoProduct', function(done) {
		execute('testCancelEventNoProduct').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testCancelEventWithState', function(done) {
		execute('testCancelEventWithState').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testContinueOrder', function(done) {
		execute('testContinueOrder').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testAddProductFullProduct', function(done) {
		execute('testAddProductFullProduct').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testAddProductProductOnly', function(done) {
		execute('testAddProductProductOnly').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testAddProductQuantityOnly', function(done) {
		execute('testAddProductQuantityOnly').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testAddProductAddQuantityToProduct', function(done) {
		execute('testAddProductAddQuantityToProduct').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testAddProductAddProductToQuantity', function(done) {
		execute('testAddProductAddProductToQuantity').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testAddProductAddProductWithStartedProduct', function(done) {
		execute('testAddProductAddProductWithStartedProduct').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testAddProductAddFullProductWithStartedProduct', function(done) {
		execute('testAddProductAddFullProductWithStartedProduct').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testAddProductAddQuantityWithStartedQuantity', function(done) {
		execute('testAddProductAddQuantityWithStartedQuantity').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testAddProductAddFullProductWithStartedQuantity', function(done) {
		execute('testAddProductAddFullProductWithStartedQuantity').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testAddProductWrongState', function(done) {
		execute('testAddProductWrongState').then(function(resp){if(resp){done();}else{done();}});
    });
	
	function execute(testName){
		return new Promise(function(resolve, reject){
			let test = tests[testName];
			// context for call to intentHandler
			let ctx = context();
			// context for call from eventHandler
			let ctx2 = context();
			
			ctx.Promise
				.then(resp => {
					index.handler(intent, ctx2, null);
				})
				.catch(err => {
					reject();
				});
			
			ctx2.Promise
			.then(resp => {
				response = resp;
				expect(response).not.toBeNull();
				expect(response).toEqual(test.response);
				resolve();
			})
			.catch(err => {
				console.log("final failed: " + err);
				error = err;
				reject();
			});
			
			intent = test.request;
			
			spyOn(uuidHelper, 'getUUID').andCallFake(function(){return "12345"});
			spyOn(snsHelper, 'sendSaveOrderMessage').andCallFake(function(){
				return new Promise(function(resolve, reject){
						resolve();
				})
			});
			spyOn(dbHelper, 'saveOrder').andCallFake(function(){
				return new Promise(function(resolve, reject){
					if(test.resolvePromise){
						resolve();
					} else {
						reject({'error': 'Error on de backend'});
					}
				})
			});
			
			spyOn(dbHelper, 'getProduct').andCallFake(function(){
				return new Promise(function(resolve, reject){
					if(test.resolvePromise){
						resolve(
								{
									'name': 'flour',
									'number': 45673556
								}
						);
					} else {
						reject({'error': 'Error on de backend'});
					}
				})
			});
			
			// spies for intent sent from eventHandler
			if(test.requestHandlerType === 'event'){
				spyOn(eventHandlers[test.eventStateHandler], test.request.request.intent.name).andCallFake(function(){ 
					this.handler.state = test.requestState;
					if(this.handler.state){
						this.emitWithState(test.requestName);
					} else {
						this.emit(test.requestName);
					}
					ctx.succeed(test.requestName); 
				});
			} else if(test.requestHandlerType === 'finishMode'){
				// since I haven't found a way to set mock the state in an intent we mock the statelessHandlers and bounce the call to the correct state
				spyOn(statelessHandlers, test.request.request.intent.name).andCallFake(function(){ 
					this.handler.state = test.requestState;
					this.emitWithState(test.request.request.intent.name);
				});
				spyOn(finishModeHandlers, test.request.request.intent.name).andCallFake(function(){ 
					this.handler.state = test.requestState;
					this.emitWithState(test.requestName); 
				});
			} else if(test.requestHandlerType === 'cancelMode'){
				// since I haven't found a way to set mock the state in an intent we mock the statelessHandlers and bounce the call to the correct state
				spyOn(statelessHandlers, test.request.request.intent.name).andCallFake(function(){ 
					this.handler.state = test.requestState;
					this.emitWithState(test.request.request.intent.name);
				});
				spyOn(cancelModeHandlers, test.request.request.intent.name).andCallFake(function(){ 
					this.handler.state = test.requestState;
					this.emitWithState(test.requestName);
				});
			} else {
				spyOn(statelessHandlers, test.request.request.intent.name).andCallFake(function(){ 
					this.handler.state = test.requestState;
					this.emit(test.requestName);
				});
			}
			
			// spies for intent sent from eventHandler
			if(test.response.handlerType === 'event'){
				spyOn(eventHandlers[test.response.stateHandler], test.response.intent).andCallFake(function(){ 
					buildResponse(this, test, response, ctx2);
				});
			} else if(test.response.handlerType === 'finishMode'){
				spyOn(finishModeHandlers, test.response.intent).andCallFake(function(){ 
					buildResponse(this, test, response, ctx2);
				});
			} else if(test.response.handlerType === 'cancelMode'){
				spyOn(cancelModeHandlers, test.response.intent).andCallFake(function(){ 
					buildResponse(this, test, response, ctx2);
				});
			} else if(test.response.handlerType === 'stateless'){
				spyOn(statelessHandlers, test.response.intent).andCallFake(function(){ 
					buildResponse(this, test, response, ctx2); 
				});
			} else {
				spyOn(speechHandlers[test.response.stateHandler], test.response.intent).andCallFake(function(){
					buildResponse(this, test, response, ctx2);
				});
			}
			
			index.handler(intent, ctx, null);
		});
	}
	
	function buildResponse(context, test, response, callback){
		response = {};
		response.handlerType = test.response.handlerType;
		response.stateHandler = test.response.stateHandler;
		response.intent = context.name.replace(context.handler.state, '');
		response.state = context.handler.state;
		if(context.attributes.order)
			response.order = context.attributes.order;
		if(context.attributes.currentProduct)
			response.currentProduct = context.attributes.currentProduct;
		callback.succeed(response); 
	}
    
    afterEach(function(){
		this.removeAllSpies();
		response = undefined;
		error = undefined;
	});
});