const index = require('../../src/index'),
	statelessHandlers = require('../../src/statelessHandlers');
let context = require('aws-lambda-mock-context'),
	tests = require('../json/index');

tests = tests.index;

describe('index', function() {
	let i = 0;
	let response;
	let error;
	
	it('testLaunchIntent', function(done) {
		execute('testLaunchRequest', 'welcomeSpeech').then(function(resp){if(resp){done();}else{done();}});
    });
	
	it('SessionEndedRequest', function(done) {
		execute('testSessionEndedRequest', 'goodbyeSpeech').then(function(resp){if(resp){done();}else{done();}});
    });
	
	function execute(testName, expectedResponse){
		return new Promise(function(resolve, reject){
			let test = testName;
	    	let ctx = context();
			ctx.Promise
				.then(resp => {
					response = resp;
					expect(response).not.toBeNull();
					expect(response).toBe(expectedResponse);
					expect(statelessHandlers.Unhandled).not.toHaveBeenCalled();
					resolve();
				})
				.catch(err => {
					response = err;
					expect(response).not.toBeNull();
					expect(response).toBe(expectedResponse);
					expect(statelessHandlers.Unhandled).not.toHaveBeenCalled();
					reject();
				});
			intent = tests[test].request;
			spyOn(statelessHandlers, tests[test].requestName).andCallFake(function(){ ctx.succeed(tests[test].response); });
			spyOn(statelessHandlers, 'Unhandled').andCallThrough();
			index.handler(intent, ctx, response);
		});
	}
    
    afterEach(function(){
		this.removeAllSpies();
		response = undefined;
		error = undefined;
	});
});