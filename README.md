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
	//optional() means this param may not in the params.
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

checkBody,checkQuery,checkParams will return a Validator instance.
when use `app.use(require('koa-validate')())` ,the request context will bind the method:

- **checkBody(filedName)** - check POST body.
- **checkQuery(filedName)** - check GET query.
- **checkQuery(filedName)** - check the params in the urls.


## Validator Api
### Access validator status:

- **addError([tip])** - 
- **hasError([tip])** - 

### Validators:

- **optional()** - the param may not in the params.
- **notEmpty([tip])** - check whether the param is no empty.
- **empty([tip])** - the params can be a empty string
- **match(pattern,[tip])** - pattern must be a RegExp instance ,eg. /abc/i
- **isInt([tip])** - check whether the param is integer.
- **isFloat([tip])** - 
- **isLength(min,[max],[tip])** - check the param length.
- **len(min,[max],[tip])** - the abbreviation of isLength.
- **isIn(arr,[tip])** - 
- **in(arr,[tip])** - the abbreviation of isIn.
- **eq(value,[tip])** - 
- **neq(value,[tip])** - 
- **gt(num,[tip])** - 
- **lt(num,[tip])** - 
- **ge(num,[tip])** - 
- **le(num,[tip])** - 
- **contains(str,[tip])** - 
- **notContains(str,[tip])** - 
- **isEmail([tip])** - 
- **isUrl([tip])** - 
- **isIp([tip])** - 
- **isAlpha([tip])** - 
- **isNumeric([tip])** - 
- **isAlphanumeric([tip])** - 
- **isBase64([tip])** - 
- **isHexadecimal([tip])** - 
- **isHexColor([tip])** - 
- **isLowercase([tip])** - 
- **isUppercase([tip])** - 
- **isDivisibleBy(num,[tip])** - 
- **isNull([tip])** - 
- **isByteLength(min,max,[tip])** - 
- **byteLength(min,max,[tip])** - the abbreviation of isByteLength.
- **isUUID([tip])** - 
- **isDate([tip])** - 
- **isTime([tip])** - 
- **isAfter(date,[tip])** - 
- **isBefore(date,[tip])** - 
- **isCreditCard([tip])** - 
- **isISBN([tip])** - 
- **isJSON([tip])** - 
- **isMultibyte([tip])** - 
- **isAscii([tip])** - 
- **isFullWidth([tip])** - 
- **isHalfWidth([tip])** - 
- **isVariableWidth([tip])** - 
- **isSurrogatePair([tip])** - 

### Sanitizers:

- **default(value)** - 
- **toDate()** - 
- **toInt()** - 
- **toFloat()** - 
- **toLowercase()** - 
- **toLow([tip])** - 
- **toUppercase()** - 
- **toUp()** - 
- **toBoolean()** - 
- **trim()** - 
- **ltrim()** - 
- **rtrim()** - 
- **escape()** - 
- **stripLow()** - 
- **whitelist(value)** - 
- **blacklist(value)** - 

## How to extends validate:

```javascript
var Validator = require('koa-validate').Validator;
// to do what you want to.
```