const index = require('../../src/index'),
	statelessHandlers = require('../../src/statelessHandlers');
let context = require('aws-lambda-mock-context'),
	tests = require('../json/index');

tests = tests.index;

describe('index', function() {
	let i = 0;
	let response;
	let error;
	
	it('testLaunchIntent', function() {
		execute('testLaunchRequest', 'welcomeSpeech');
    });
	
	it('SessionEndedRequest', function() {
		execute('testSessionEndedRequest', 'goodbyeSpeech')
    });
	
	function execute(testName, expectedResponse){
		let test = testName;
    	let ctx = context();
		ctx.Promise
			.then(resp => {
				response = resp;
				expect(response).not.toBeNull();
				expect(response).toBe(expectedResponse);
				expect(intentHandlers.Unhandled).not.toHaveBeenCalled();
			})
			.catch(err => {
				response = err;
				expect(response).not.toBeNull();
				expect(response).toBe(expectedResponse);
				expect(intentHandlers.Unhandled).not.toHaveBeenCalled();
			});
		intent = tests[test].request;
		index.handler(intent, ctx, response);
		spyOn(statelessHandlers, tests[test].requestName).andCallFake(function(){ ctx.succeed(tests[test].response); });
		spyOn(statelessHandlers, 'Unhandled').andCallThrough();
	}
    
    afterEach(function(){
		this.removeAllSpies();
		response = undefined;
		error = undefined;
	});
});