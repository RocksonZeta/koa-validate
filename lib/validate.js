'use strict';
var debug = require('debug')('koa-validate');

module.exports=function(opt){
	debug('use koa-validate');
	var opt = opt ||{};

	return function*(next){
		debug('init koa-validate');
		this.checkBody = function(key){
			return new Validator(this,key,this.request.body[key],key in this.request.body);
		};
		this.checkQuery = function(key){
			return new Validator(this,key,this.request.query[key],key in this.request.query);
		};
		// this.checkParams = function(key){
		// 	var params = {} ,k;
		// 	for(k in this.query){
		// 		params[k]= this.query[k];
		// 	}
		// 	for(k in this.body){
		// 		params[k]= this.body[k];
		// 	}
		// 	return new Validator(params, name);
		// };
		this.checkParams = function(key){
			return new Validator(this,key,this.request.params[key],key in this.request.params);
		};
		yield next;
	};

};


var v = require('validator');
function Validator(context,key,value,exists){
	debug('validate for %s %s',key,value);
	this.context = context;
	this.key = key;
	this.value = value;
	this.exists = exists;
//	this.status = 0;
	//this.context.errors = [];
	this.isOptional = false;
	this.isNumber = false;
	this.goOn = true;
}

Validator.prototype.addError = function(tip){
	this.goOn = false;
	if(!this.context.errors){
		this.context.errors = [];
	}
	var e ={};
	e[this.key] = tip;
	this.errors.push(e);
};
Validator.prototype.optional = function(){
	if(!this.exists){
		this.goOn = false;
		this.isOptional = true;
	}
	return this;
};
Validator.prototype.notEmpty = function(tip){
	if(this.params[this.key]){
		this.addError(tip || this.key+" can not be empty.");
	}
	return this;
};
Validator.prototype.empty = function(){
	if(this.goOn){
		if(!this.value){
			this.goOn = false;
		}
	}
	return this;
};
Validator.prototype.match = function(reg , tip){
	if(this.goOn){
		if(!reg.test(this.value)){
			this.addError(tip|| this.key+" is bad format.");
		}
	}
	return this;
};
Validator.prototype.isInt = function(tip){
	if(this.goOn){
		if(!v.isInt(this.value)){
			this.addError(tip|| this.key+" is not integer.");
		}
	}
	return this;
};
Validator.prototype.isFloat = function(){
	if(this.goOn){
		if(!v.isInt(this.value)){
			this.addError(tip|| this.key+" is not float.");
		}
	}
	return this;
};


Validator.prototype.len = function(min,max, tip){
return this;
};
Validator.prototype.in = function(arr, tip){
return this;
};
Validator.prototype.eq = function(l , tip){
return this;
};
Validator.prototype.neq = function(l){
return this;
};
Validator.prototype.contains = function(s){
return this;
};
Validator.prototype.notContains = function(s){
return this;
};
Validator.prototype.isEmail = function(){
return this;
};
Validator.prototype.isUrl = function(s){
return this;
};
Validator.prototype.isIp = function(){
return this;
};
Validator.prototype.isAlpha = function(s){
return this;
};
Validator.prototype.isNumeric = function(s){
return this;
};
Validator.prototype.isAlphanumeric = function(s){
return this;
};
Validator.prototype.isBase64 = function(){
return this;
};
Validator.prototype.isHexadecimal = function(){
return this;
};
Validator.prototype.isHexColor = function(){
return this;
};
Validator.prototype.isLowercase = function(){
return this;
};
Validator.prototype.isUppercase = function(){
return this;
};
Validator.prototype.isDivisibleBy = function(n){
return this;
};
Validator.prototype.isNull = function(){
return this;
};
Validator.prototype.isByteLength = function(l){
return this;
};
Validator.prototype.isUUID = function(v){
return this;
};
Validator.prototype.isDate = function(){
return this;
};
Validator.prototype.isTime = function(){
return this;
};
Validator.prototype.isDatetime = function(){
return this;
};
Validator.prototype.isDate = function(){
return this;
};
Validator.prototype.isAfter = function(){
return this;
};
Validator.prototype.isBefore = function(){
return this;
};
Validator.prototype.isCreditCard = function(){
return this;
};
Validator.prototype.isISBN = function(s){
return this;
};
Validator.prototype.isJSON = function(s){
return this;
};

Validator.prototype.isMultibyte = function(s){
return this;
};
Validator.prototype.isAscii = function(s){
return this;
};
Validator.prototype.isFullWidth = function(s){
return this;
};
Validator.prototype.isHalfWidth = function(s){
return this;
};
Validator.prototype.isVariableWidth = function(s){
return this;
};
Validator.prototype.isSurrogatePair = function(){
return this;
};


//Sanitizers

Validator.prototype.toString = function(){

};
Validator.prototype.toDate = function(){

};
Validator.prototype.toInt = function(){

};
Validator.prototype.toFloat = function(){

};
Validator.prototype.toBoolean = function(){

};
Validator.prototype.trim = function(){

};
Validator.prototype.ltrim = function(){

};
Validator.prototype.rtrim = function(){

};
Validator.prototype.escape = function(){

};
Validator.prototype.stripLow = function(){

};
Validator.prototype.whitelist = function(){

};
Validator.prototype.blacklist = function(){

};
Validator.prototype.dexss = function(){

};
Validator.prototype.dexss = function(){

};