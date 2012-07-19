var Module = require('module'),	// capitalize to not override the `module` reference defined by `require`
	fs = require('fs');

var cache = {},
	prevModuleHeader = Module.wrapper[0]; // caching original wrapper

function restoreModule() {
	Module.wrapper[0] = prevModuleHeader;
}

function dispatch(filename, injected, recursive) {
	return _dispatch(filename, injected, recursive, module.parent);
}

dispatch._withParent = function(parentModule) {
	return function(filename, injected, recursive) {
		return _dispatch(filename, injected, recursive, parentModule);
	}
}

function _dispatch(filename, injected, recursive, parentModule) {
	// Resolve full filename relative to the parent module
	filename = Module._resolveFilename(filename, parentModule);

	if (! injected)
		return require(filename);

	if (! cache[filename])
		cache[filename] = {};

	if (! cache[filename][injected])
		cache[filename][injected] = runInContext(filename, injected, recursive);
	
	return cache[filename][injected];
}

function runInContext(filename, injected, recursive, parentModule) {
	if (recursive !== false)
		Module.wrapper[0] += 'require = require("mattisg.requirewith")._withParent(module);';	// this is why the module has to be installed in order to work properly

	for (var k in injected)
		Module.wrapper[0] += 'var ' + k + '=' + JSON.stringify(injected[k]) + ';';

	// Create loadedModule as it would be created by require()
	var loadedModule = new Module(filename, parentModule);

	loadedModule.load(loadedModule.id);
	
	restoreModule();

	return loadedModule.exports;
}

module.exports = dispatch;
