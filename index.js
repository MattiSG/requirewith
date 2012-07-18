var vm = require('vm'),
	path = require('path'),
	fs = require('fs');

function dispatch(filename, injected) {
	if (filename.charAt(0) == '.')	// handle local files
		filename = path.resolve(path.dirname(module.parent.filename), filename);
	
	if (injected)
		return runInContext(filename, injected);
	else
		return require(filename);
}

function runInContext(filename, sandbox) {
	var fullpath = require.resolve(filename),
		content = fs.readFileSync(fullpath, 'utf8');

	// remove shebang
	content = stripBOM(content).replace(/^\#\!.*/, '');

	// emulate require()
	for (var k in global)
		sandbox[k] = global[k];

	sandbox.require = require;
	sandbox.__filename = fullpath;
	sandbox.__dirname = path.dirname(fullpath) + '/';
	sandbox.exports = {};
	sandbox.module = sandbox;
	sandbox.global = sandbox;

	vm.runInNewContext(content, sandbox);
	return sandbox.exports;
}

// From lib/module.js in the Node.js core (v.0.5.3)
function stripBOM(content) {
	// Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
	// because the buffer-to-string conversion in `fs.readFileSync()`
	// translates it to FEFF, the UTF-16 BOM.
	if (content.charCodeAt(0) === 0xFEFF)
		content = content.slice(1);

	return content;
}

module.exports = dispatch;
