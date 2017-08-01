const index = require('../../src/index'),
	statelessHandlers = require('../../src/statelessHandlers'),
	eventHandlers = require('../../src/eventHandlers'),
	speechHandlers = require('../../src/speechHandlers');
let context = require('aws-lambda-mock-context'),
	tests = require('../json/index');

tests = tests.statelessHandlers;

describe('index', function() {
	let i = 0;
	let response;
	let error;
	
	it('testLaunchIntent', function() {
		execute('testLaunchRequest', 'welcomeSpeech', true);
    });
	
	it('SessionEndedRequest', function() {
		execute('testSessionEndedRequest', 'goodbyeSpeech', true)
    });
	
	function execute(testName, expectedResponse, positiveTestCase){
		let test = testName;
    	let ctx = context();
		ctx.Promise
			.then(resp => {
				response = resp;
				expect(response).not.toBeNull();
				expect(response).toBe(expectedResponse);
				if(!positiveTestCase){
					expect(intentHandlers.Unhandled).not.toHaveBeenCalled();
				}
			})
			.catch(err => {
				response = err;
				expect(response).not.toBeNull();
				expect(response).toBe(expectedResponse);
				if(!positiveTestCase){
					expect(intentHandlers.Unhandled).not.toHaveBeenCalled();
				}
			});
		intent = tests[test].request;
		index.handler(intent, ctx, response);
		if(tests[test].responseHandlerType === 'event'){
			spyOn(eventHandlers.statelessHandlers, tests[test].responseIntent).andCallFake(function(){ ctx.succeed(tests[test].response); });
		} else {
			spyOn(speechHandlers.statelessHandlers, tests[test].responseIntent).andCallFake(function(){ ctx.succeed(tests[test].response); });
		}
		spyOn(statelessHandlers, 'Unhandled').andCallThrough();
	}
    
    afterEach(function(){
		this.removeAllSpies();
		response = undefined;
		error = undefined;
	});
});