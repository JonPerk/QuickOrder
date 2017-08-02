const index = require('../../src/index'),
	cancelModeHandlers = require('../../src/cancelModeHandlers'),
	statelessHandlers = require('../../src/statelessHandlers'),
	eventHandlers = require('../../src/eventHandlers'),
	speechHandlers = require('../../src/speechHandlers');
let context = require('aws-lambda-mock-context'),
	tests = require('../json/index');

tests = tests.cancelModeHandlers;

describe('cancelModeHandlers', function() {
	let i = 0;
	let response;
	let error;
	
	it('testLaunchIntent', function(done) {
		execute('testLaunchRequest', 'unhandledSpeech', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testSessionEndedRequest', function(done) {
		execute('testSessionEndedRequest', 'cancelOrder', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testOrderProductIntent', function(done) {
		execute('testOrderProductIntent', 'unhandledSpeech', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testOrderProductWithQuantityIntent', function(done) {
		execute('testOrderProductWithQuantityIntent', 'unhandledSpeech', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testOrderQuantityIntent', function(done) {
		execute('testOrderQuantityIntent', 'unhandledSpeech', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testRepeatOrderIntent', function(done) {
		execute('testRepeatOrderIntent', 'repeatOrder', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testFinishOrderIntent', function(done) {
		execute('testFinishOrderIntent', 'unhandledSpeech', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testCancelOrderIntent', function(done) {
		execute('testCancelOrderIntent', 'cancelOrder', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testYesIntent', function(done) {
		execute('testYesIntent', 'cancelOrder', false).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testNoIntent', function(done) {
		execute('testNoIntent', 'continueOrder', false).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testHelpIntent', function(done) {
		execute('testHelpIntent', 'helpSpeech', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testStopIntent', function(done) {
		execute('testStopIntent', 'continueOrder', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testCancelIntent', function(done) {
		execute('testCancelIntent', 'continueOrder', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testUnhandledIntent', function(done) {
		let test = 'testUnhandledIntent';
    	let ctx = context();
		ctx.Promise
			.then(resp => {
				response = resp;
				expect(response).not.toBeNull();
				expect(response).toBe('unhandledSpeech');
				expect(statelessHandlers.Unhandled).toHaveBeenCalled();
				done();
			})
			.catch(err => {
				response = err;
				expect(response).not.toBeNull();
				expect(response).toBe('unhandledSpeech');
				expect(statelessHandlers.Unhandled).toHaveBeenCalled();
				done();
			});
		intent = tests[test].request;
		spyOn(statelessHandlers, tests[test].requestName).andCallFake(function(){ 
			this.handler.state = "_CANCEL_MODE";
			this.emitWithState(tests[test].requestName);
		});
		spyOn(speechHandlers.cancelModeHandlers, tests[test].response).andCallFake(function(){ ctx.succeed(tests[test].response); });
		spyOn(cancelModeHandlers, 'Unhandled').andCallThrough();
		index.handler(intent, ctx, response);
    });
	
	function execute(testName, expectedResponse, positiveTestCase){
		return new Promise(function(resolve, reject){
			let test = testName;
	    	let ctx = context();
			ctx.Promise
				.then(resp => {
					response = resp;
					expect(response).not.toBeNull();
					expect(response).toBe(expectedResponse);
					if(positiveTestCase){
						expect(cancelModeHandlers.Unhandled).not.toHaveBeenCalled();
					}
					resolve();
				})
				.catch(err => {
					response = err;
					expect(response).not.toBeNull();
					expect(response).toBe(expectedResponse);
					if(positiveTestCase){
						expect(cancelModeHandlers.Unhandled).not.toHaveBeenCalled();
					}
					reject();
				});
			intent = tests[test].request;
			spyOn(statelessHandlers, tests[test].requestName).andCallFake(function(){ 
				this.handler.state = "_CANCEL_MODE";
				this.emitWithState(tests[test].requestName);
			});
			if(tests[test].responseHandlerType === 'event'){
				spyOn(eventHandlers.cancelModeHandlers, tests[test].response).andCallFake(function(){ ctx.succeed(tests[test].response); });
			} else {
				spyOn(speechHandlers.cancelModeHandlers, tests[test].response).andCallFake(function(){ ctx.succeed(tests[test].response); });
			}
			if(positiveTestCase){
				spyOn(cancelModeHandlers, 'Unhandled').andCallThrough();
			} else {
				spyOn(cancelModeHandlers, 'Unhandled').andCallFake(function(){ ctx.succeed(tests[test].response); });
			}
			index.handler(intent, ctx, response);
		});
	}
    
    afterEach(function(){
		this.removeAllSpies();
		response = undefined;
		error = undefined;
	});
});