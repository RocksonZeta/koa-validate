koa-validate
============

[![Build Status](https://travis-ci.org/RocksonZeta/koa-validate.svg?branch=master)](https://travis-ci.org/RocksonZeta/koa-validate)
[![Coverage Status](https://coveralls.io/repos/RocksonZeta/koa-validate/badge.png?branch=master)](https://coveralls.io/r/RocksonZeta/koa-validate?branch=master)
[![NPM version](https://badge.fury.io/js/koa-validate.svg)](http://badge.fury.io/js/koa-validate)
[![Dependency Status](https://david-dm.org/RocksonZeta/koa-validate.svg)](https://david-dm.org/RocksonZeta/koa-validate)

[![NPM](https://nodei.co/npm/koa-validate.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/koa-validate/)

validate koa request params and format request params 

## Installation
```
$ npm install koa-validate --save
```

## Basic usage:
```javascript
'use strict';
var koa = require('koa');
var app = koa();
var router = require('koa-router')();
require('koa-validate')(app);

app.use(require('koa-body')({multipart:true , formidable:{keepExtensions:true}}));
app.use(router.routes()).use(router.allowedMethods());
router.post('/signup', function * () {
	//optional() means this param may not in the params.
	this.checkBody('name').optional().len(2, 20,"are you kidding me?");
	this.checkBody('email').isEmail("your enter a bad email.");
	this.checkBody('password').notEmpty().len(3, 20).md5();
	//empty() mean this param can be a empty string.
	this.checkBody('nick').optional().empty().len(3, 20);
	//also we can get the sanitized value 
	var age = this.checkBody('age').toInt().value;
	yield this.checkFile('icon').notEmpty().size(0,300*1024,'file too large').move("/static/icon/" , function*(file,context){
		//resize image
	});
	if (this.errors) {
		this.body = this.errors;
		return;
	}
});
router.get('/users', function * () {
	this.checkQuery('department').empty().in(["sale","finance"], "not support this department!").len(3, 20);	
	this.checkQuery('name').empty().len(2,20,"bad name.").trim().toLow();
	this.checkQuery('age').empty().gt(10,"too young!").lt(30,"to old!").toInt();
	if (this.errors) {
		this.body = this.errors;
		return;
	}
});
router.get('/user/:id', function * () {
	this.checkParams('id').toInt(0);
	if (this.errors) {
		this.body = this.errors;
		return;
	}
});
//json body,we can check it using [json path](https://github.com/flitbit/json-path)(like xpath)
router.post('/json' , function*(){
	this.checkBody('/store/book[0]/price').get(0).eq(8.95);
	this.checkBody('#/store/book[0]/category').first().trim().eq('reference');
	if (this.errors) {
		this.body = this.errors;
		return;
	}
})

app.listen(3000);
```

## API

checkBody,checkQuery,checkParams will return a Validator instance.
when use `require('koa-validate')(app)` ,the request context will bind the method:

- **checkBody(fieldName,[transFn])** - check POST body.`,transFn` see [json-path](https://github.com/flitbit/json-path#more-power).it will not use json path if `transFn` is `false`.
- **checkQuery(fieldName,[transFn])** - check GET query.`,transFn` see [json-path](https://github.com/flitbit/json-path#more-power).it will not use json path if `transFn` is `false`.
- **checkParams(fieldName)** - check the params in the urls.
- **checkFile(fieldName,[deleteOnCheckFailed])** - check the file object, if you use [koa-body](https://github.com/dlau/koa-body).this function will return `FileValidator` object. `deleteOnCheckFailed` default value is `true`
- **checkHeader(fieldName)** - check the params in the request http header.


## Validator API
### Access validator status:

- **addError(tip)** - add an error to validator errors.
- **hasError()** - check if validator has errors.
- **value** - the value of current validator.

### Validators:
`options`,`version` or `locale` please see [validator](https://github.com/chriso/validator.js)

- **optional()** - the param may not in the params.if the param not exists,it has no error,no matter whether have other checker or not.
- **empty([tip])** - the params can be a empty string.
- **notEmpty([tip])** - check if the param is not empty.
- **notBlank([tip])** - check if the param is not blank,use /^\s*$/gi reg to check.
- **match(pattern,[tip])** - pattern must be a RegExp instance ,eg. /abc/i
- **notMatch(pattern,[tip])** - pattern must be a RegExp instance ,eg. /xyz/i
- **ensure(assertion, [tip], [shouldBail])** if assertion is false,the asserting failed.
- **ensureNot(assertion, [tip], [shouldBail])** if assertion is true,the asserting failed.
- **isInt([tip],[options])** - check if the param is integer.
- **isFloat([tip],[options])** - check if the param is float.
- **isLength(min,[max],[tip])** - check the param length.
- **len(min,[max],[tip])** - the abbreviation of isLength.
- **isIn(arr,[tip])** - check if the param is in the array.
- **in(arr,[tip])** - the abbreviation of isIn.
- **eq(value,[tip])** - check if the param equal to the value.
- **neq(value,[tip])** - check if the param not equal to the value.
- **gt(num,[tip])** - check if the param great then the value.
- **lt(num,[tip])** - check if the param less then the value.
- **ge(num,[tip])** - check if the param great then or equal the value.
- **le(num,[tip])** - check if the param less then or equal the value.
- **contains(str,[tip])** - check if the param contains the str.
- **notContains(str,[tip])** - check if the param not contains the str.
- **isEmail([tip],[options])** - check if the param is an email.
- **isUrl([tip],[options])** - check if the param is an URL.
- **isIp([tip])** - check if the param is an IP (version 4 or 6).
- **isAlpha([tip],[locale])** - check if the param contains only letters (a-zA-Z).
- **isNumeric([tip])** - check if the param contains only numbers.
- **isAlphanumeric([tip],[locale])** - check if the param contains only letters and numbers.
- **isBase64([tip])** - check if a param is base64 encoded.
- **isHexadecimal([tip])** - check if the param is a hexadecimal number.
- **isHexColor([tip])** - check if the param is a hexadecimal color.
- **isLowercase([tip])** - check if the param is lowercase.
- **isUppercase([tip])** - check if the param is uppercase.
- **isDivisibleBy(num,[tip])** - check if the param is a number that's divisible by another.
- **isNull([tip])** - check if the param is null.
- **isByteLength(min,max,[tip])** - check if the param's length (in bytes) falls in a range.
- **byteLength(min,max,[tip])** - the abbreviation of isByteLength.
- **isUUID([tip],[version])** - check if the param is a UUID (version 3, 4 or 5).
- **isDate([tip])** - check if the param is a date.
- **isAfter(date,[tip])** - check if the param is a date that's after the specified date.
- **isBefore(date,[tip])** - check if the param is a date that's before the specified date.
- **isCreditCard([tip])** - check if the param is a credit card.
- **isISBN([tip],version)** - check if the param is an ISBN (version 10 or 13).
- **isJSON([tip])** - check if the param is valid JSON (note: uses JSON.parse).
- **isMultibyte([tip])** - check if the param contains one or more multibyte chars.
- **isAscii([tip])** - check if the param contains ASCII chars only.
- **isFullWidth([tip])** - check if the param contains any full-width chars.
- **isHalfWidth([tip])** - check if the param contains any half-width chars.
- **isVariableWidth([tip])** - check if the param contains a mixture of full and half-width chars
- **isSurrogatePair([tip])** - check if the param contains any surrogate pairs chars.
- **isCurrency([tip],[options])** - check if the param is a currency.
- **isDataURI([tip])** - check if the param is a data uri.
- **isMobilePhone([tip],[locale])** - check if the param is a mobile phone.
- **isISO8601([tip])** - check if the param is a ISO8601 string. eg.2004-05-03
- **isMACAddress([tip])** - check if the param is a MAC address.eg.C8:3A:35:CC:ED:80
- **isISIN([tip])** - check if the param is a ISIN.
- **isFQDN([tip],[options])** - check if the param is a fully qualified domain name. eg.www.google.com


### Sanitizers:

- **default(value)** - if the param not exits or is an empty string, it will take the default value.
- **toDate()** - convert param  to js Date object.
- **toInt([tip],[radix],[options])** - convert param to integer.`radix` for `toInt`,`options` for `isInt`.
- **toFloat([tip])** - convert param to float.
- **toLowercase()** - convert param to lowercase.
- **toLow()** - same as toLowercase.
- **toUppercase()** - convert param to uppercase.
- **toUp()** - same as toUppercase.
- **toBoolean()** - convert the param to a boolean. Everything except for '0', 'false' and '' returns true. In strict mode only '1' and 'true' return true.
- **toJson([tip])** - convert param to json object.
- **trim([chars])** - trim characters (whitespace by default) from both sides of the param.
- **ltrim([chars])** -  trim characters from the left-side of the param.
- **rtrim([chars])** -  trim characters from the right-side of the param.
- **escape()** -  replace <, >, & and " with HTML entities.
- **stripLow()** -  remove characters with a numerical value < 32 and 127, mostly control characters. 
- **whitelist(value)** - remove characters that do not appear in the whitelist.
- **blacklist(value)** - remove characters that appear in the blacklist.
- **encodeURI()** - ref mdn [encodeURI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)
- **decodeURI([tip])** - ref mdn [decodeURI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI)
- **encodeURIComponent()** - ref mdn [encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
- **decodeURIComponent([tip])** - ref mdn [decodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)
- **replace(regexp|substr, newSubStr|function)** - the same as [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) replace 
- **clone(newKey,[newValue])** - clone current value to the new key, if newValue supplied , use it. eg. `this.checkBody('v1').clone('md5').md5()`; then your can use `this.request.body.md5`.
- **encodeBase64()** - encode current value to base64 string.
- **decodeBase64([inBuffer],[tip])** - decode current base64 to a normal string,if inBuffer is true , the value will be a Buffer.
- **hash(alg , [encoding])** - hash current value use specified algorithm and encoding(if supplied , default is 'hex'). ref [hash](http://nodejs.org/api/crypto.html#crypto_class_hash)
- **md5()** - md5 current value into hex string.
- **sha1()** - sha1 current value into hex string.

### For json path:
- **check(fn,tip,scope)** - if fn return `false` then check failed.fn format `function(value,key,requestParams):boolean`
- **filter(fn,scope)** - filter the value if value is array.fn format `function(value,index,key,requestParams):boolean`
- **get(index)** - change the value to the specified index value
- **first()** - get the first value!

### FileValidator:

#### Validators:

- **empty()** - current file field can to be a empty file.
- **notEmpty([tip])** - current file field can not to be a empty file.
- **size(min,max,[tip])** - limit the file size.
- **contentTypeMatch(reg,[tip])** - check the file's contentType with regular expression.
- **isImageContentType([tip])** - check the file's contentType if is image content type.
- **fileNameMatch(reg,[tip])** - check the file's name with regular expression.
- **suffixIn(arr,[tip])** - check the suffix of file's if in specified arr. `arr` eg. ['png','jpg']

#### Sanitizers:
File sanitizers are generators,we should use `yield` to execute them. eg. `yield this.checkFile('file').notEmpty().copy('/')`;

- **move(target,[afterMove])** - move upload file to the target location. target can be a `string` or `function` or `function*`.if target end with '/' or '\\',the target will be deemed as directory.
target function interface:`string function(fileObject,fieldName,context)`.this function will return a string of the target file.
afterMove:it can be a `function` or `function*`.interface:`function(fileObject,fieldName,context)`
- **copy(target,[afterCopy])** - move upload file to the target location. target can be a `string` or `function` or `function*`. target function interface:`function (fileObject,fieldName,context)` .
afterCopy:it can be a `function` or `function*`.interface:`function(fileObject,fieldName,context)`
- **delete()** - delete upload file.



## How to extends validate:

```javascript
var Validator = require('koa-validate').Validator;
// to do what you want to.
//you can use this.key ,this.value,this.params,this.context,this.exists
//use addError(tip) , if you meet error.
```