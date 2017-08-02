const index = require('../../src/index'),
	statelessHandlers = require('../../src/statelessHandlers'),
	eventHandlers = require('../../src/eventHandlers'),
	speechHandlers = require('../../src/speechHandlers');
let context = require('aws-lambda-mock-context'),
	tests = require('../json/index');

tests = tests.statelessHandlers;

describe('statelessHandlers', function() {
	let i = 0;
	let response;
	let error;
	
	it('testLaunchIntent', function(done) {
		execute('testLaunchRequest', 'newSession', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testSessionEndedRequest', function(done) {
		execute('testSessionEndedRequest', 'cancelOrder', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testOrderProductIntent', function(done) {
		execute('testOrderProductIntent', 'addProduct', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testOrderProductWithQuantityIntent', function(done) {
		execute('testOrderProductWithQuantityIntent', 'addProduct', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testOrderQuantityIntent', function(done) {
		execute('testOrderQuantityIntent', 'addProduct', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testRepeatOrderIntent', function(done) {
		execute('testRepeatOrderIntent', 'repeatOrder', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testFinishOrderIntent', function(done) {
		execute('testFinishOrderIntent', 'finishOrderSpeech', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testCancelOrderIntent', function(done) {
		execute('testCancelOrderIntent', 'cancelOrderSpeech', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testYesIntent', function(done) {
		execute('testYesIntent', 'unhandledSpeech', false).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testNoIntent', function(done) {
		execute('testNoIntent', 'unhandledSpeech', false).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testHelpIntent', function(done) {
		execute('testHelpIntent', 'helpSpeech', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testStopIntent', function(done) {
		execute('testStopIntent', 'cancelEvent', true).then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('testCancelIntent', function(done) {
		execute('testCancelIntent', 'cancelEvent', true).then(function(resp){if(resp){done();}else{done();}});
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
		spyOn(speechHandlers.statelessHandlers, tests[test].response).andCallFake(function(){ ctx.succeed(tests[test].response); });
		spyOn(statelessHandlers, 'Unhandled').andCallThrough();
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
						expect(statelessHandlers.Unhandled).not.toHaveBeenCalled();
					}
					resolve();
				})
				.catch(err => {
					response = err;
					expect(response).not.toBeNull();
					expect(response).toBe(expectedResponse);
					if(positiveTestCase){
						expect(statelessHandlers.Unhandled).not.toHaveBeenCalled();
					}
					reject();
				});
			intent = tests[test].request;
			if(tests[test].responseHandlerType === 'event'){
				spyOn(eventHandlers.statelessHandlers, tests[test].response).andCallFake(function(){ ctx.succeed(tests[test].response); });
			} else {
				spyOn(speechHandlers.statelessHandlers, tests[test].response).andCallFake(function(){ ctx.succeed(tests[test].response); });
			}
			if(positiveTestCase){
				spyOn(statelessHandlers, 'Unhandled').andCallThrough();
			} else {
				spyOn(statelessHandlers, 'Unhandled').andCallFake(function(){ ctx.succeed(tests[test].response); });
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