# RequireInContext

Allows you to do a require() with a custom context.

Useful for emulating a browser environment in Node:

    var requireInContext = require('runincontext');
    var myclient = requireInContext('./myclient.js', {
      window: {},
      io: require('socket.io')
    });

Or for specifying mock objects for running tests:

    var requireInContext = require('runincontext');
    var mycode = requireInContext('./mycode.js', {
      mydependency: require('./dependency_mock.js')
    });


        
