var Module = require('module'),	// capitalize to not override the `module` reference defined by `require`
	fs = require('fs');

var cache = {},
	prevModuleHeader = Module.wrapper[0]; // caching original wrapper

function restoreModule() {
	Module.wrapper[0] = prevModuleHeader;
}

function dispatch(filename, injected, recursive) {
	// Resolve full filename relative to the parent module
	filename = Module._resolveFilename(filename, module.parent);

	if (! injected)
		return require(filename);

	if (! cache[filename])
		cache[filename] = {};

	if (! cache[filename][injected])
		cache[filename][injected] = runInContext(filename, injected, recursive);
	
	return cache[filename][injected];
}

function runInContext(filename, injected, recursive) {
	if (recursive !== false)
		Module.wrapper[0] += 'require = require("mattisg.requireincontext");';	// this is why the module has to be installed in order to work properly

	for (var k in injected)
		Module.wrapper[0] += 'var ' + k + '=' + JSON.stringify(injected[k]) + ';';

	// Create loadedModule as it would be created by require()
	var loadedModule = new Module(filename, module.parent);

	loadedModule.load(loadedModule.id);
	
	restoreModule();

	return loadedModule.exports;
}

module.exports = dispatch;
