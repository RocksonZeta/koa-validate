koa-validate
============

[![Build Status](https://travis-ci.org/RocksonZeta/koa-validate.svg?branch=master)](https://travis-ci.org/RocksonZeta/koa-validate)
[![Coverage Status](https://coveralls.io/repos/RocksonZeta/koa-validate/badge.png?branch=master)](https://coveralls.io/r/RocksonZeta/koa-validate?branch=master)
[![NPM version](https://badge.fury.io/js/koa-validate.svg)](http://badge.fury.io/js/koa-validate)
![dependencies](https://david-dm.org/RocksonZeta/koa-validate.png)

validate koa request params and format request params 

##installation
```
$ npm install koa-validate
```

## basic usage:
```javascript
	'use strict';
	var koa = require('koa');
	var app = koa();

	app.use(require('koa-body')());
	app.use(require('koa-validate')());
	app.use(require('koa-router')(app));
	app.post('/signup', function * () {
		//optional() means this param may be in the params.
		this.checkBody('name').optional().len(2, 20,"are you kidding me?");
		this.checkBody('email').isEmail("your enter a bad email.");
		this.checkBody('password').notEmpty().len(3, 20);
		//empty() mean this param can be a empty string.
		this.checkBody('nick').optional().empty().len(3, 20);
		this.checkBody('age').toInt();
		if (this.errors) {
			this.body = this.errors;
			return;
		}
		this.body = this.body;
	});
	app.get('/users', function * () {
		this.checkQuery('department').empty().in(["sale","finance"], "not support this department!").len(3, 20);	
		this.checkQuery('name').empty().len(2,20,"bad name.").trim().toLow();
		this.checkQuery('age').empty().gt(10,"too young!").lt(30,"to old!").toInt();
		if (this.errors) {
			this.body = this.errors;
			return;
		}
		this.body = this.query;
	});
	app.get('/user/:id', function * () {
		this.checkParams('id').toInt(0);
		if (this.errors) {
			this.body = this.errors;
			return;
		}
		this.body = this.params;
	});

	app.listen(3000);
```

## how to extends validate