var requireInContext = require('../index'),
	assert = require('assert');

assert.strictEqual(require('./localModule'), true, "Local module could not be required properly, test case is broken.");

assert.strictEqual(requireInContext('./localModule'), true, "Local module could not be requiredInContext properly, compatibility with require is broken.");

var PAYLOAD = 'toto';
assert.strictEqual(requireInContext('./boomerang', {
	payload: PAYLOAD
}), PAYLOAD, "Passed value is not transmitted properly.");

console.log('All tests pass  :)');
