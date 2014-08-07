koa-validate
============

validate koa request params and format request params 

[![Build Status](https://travis-ci.org/RocksonZeta/koa-validate.svg?branch=master)](https://travis-ci.org/RocksonZeta/koa-validate)

##installation
```
$ npm install koa-validate
```

## basic usage:
```javascript
	app.use(require('koa-body')());
	app.use(require('koa-validate')());
	app.use(require('koa-router')(app));
	app.post('/signup',function*(){
		this.checkBody('name').optional().len(3,20);
		this.checkBody('email').isEmail();
		this.checkBody('password').notEmpty().len(3,20);
		this.checkBody('nick').optional().empty().len(3,20);
		this.checkBody('age').toInt();
		if(this.errors){
			return this.body = this.errors;
		}
		this.body= 'ok';
	});
```