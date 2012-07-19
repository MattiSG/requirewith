RequireWith
===========

Allows you to do inject dependencies in (i.e. pass variables to) a `require`d module.

Usage
-----

	var requireWith = require('mattisg.requirewith');
	var mod = requireWith('./mymodule', {
		config: config,
		client: someVar
	});

Then, the `config` and `client` variables will be available in `mymodule`.

Redefining `require`
--------------------

You can even redefine `require` for a one-line replacement:

	require = require('mattisg.requirewith');

This module calls `require` directly if no argument other than the module name is given, so it is perfectly safe to redefine `require`. Actually, unless you specify so explicitly, this will automatically be done recursively for modules required with injections.

To disable recursive redefinitions, pass `false` as the third argument. To summarize:

	require = require('mattisg.requirewith');

	var path = require('path');	// exactly the same as no redefinition

	var mymod = require('./mymodule', {	// config can be used in mymodule, and mymodule does not need to redefine require to get injection capabilities
		config: config
	});

	var norec = requireWith('./mymodule', {	// config can be used in mymodule, but it gets only the default require
		config: config
	}, false);

# Installation

npm install mattisg.requirewith
