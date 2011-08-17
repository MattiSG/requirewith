var vm = require('vm');
var path = require('path');

// From lib/module.js in the Node.js core (v.0.5.3)
function stripBOM(content) {
  // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
  // because the buffer-to-string conversion in `fs.readFileSync()`
  // translates it to FEFF, the UTF-16 BOM.
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

function runInContext(filename, sandbox) {  
  var content = require('fs').readFileSync(require.resolve(filename), 'utf8');
  // remove shebang
  content = stripBOM(content).replace(/^\#\!.*/, '');

  // emulate require()  
  for (var k in global) {
    sandbox[k] = global[k];
  }
  sandbox.require = require;
  sandbox.__filename = filename;
  sandbox.__dirname = path.dirname(filename);
  sandbox.exports = {};
  sandbox.module = sandbox;
  sandbox.global = sandbox;

  vm.runInNewContext(content, sandbox);
  return sandbox.exports;
}

module.exports = runInContext;
