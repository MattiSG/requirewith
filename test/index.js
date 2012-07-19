var requireInContext = require('../index'),
	assert = require('assert');

assert.strictEqual(require('./localModule'), true, "Local module could not be required properly, test case is broken.");

assert.strictEqual(requireInContext('./localModule'), true, "Local module could not be requiredInContext properly, compatibility with require is broken.");

var HALF_PAYLOAD = 'to';	// see recursive.js to understand why it is useful to write the test this way.
var PAYLOAD = HALF_PAYLOAD + HALF_PAYLOAD;
assert.strictEqual(requireInContext('./boomerang', {
	payload: PAYLOAD
}), PAYLOAD, "Passed value is not transmitted properly.");

var REQUIRED_MODULE = 'path';
assert.strictEqual(requireInContext('./pathRequirer', {
	passedModule: REQUIRED_MODULE
}), require(REQUIRED_MODULE), "Inner requires fail.")

assert.strictEqual(requireInContext('./recursive', {
	halfPayload: HALF_PAYLOAD
}), PAYLOAD, "Recursively passed value is not transmitted properly.");

console.log('All tests pass  :)');
