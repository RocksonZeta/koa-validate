'use strict';
var debug = require('debug')('koa-validate');

module.exports = function(opt) {
	debug('use koa-validate');
	var opt = opt || {};

	return function * (next) {
		debug('init koa-validate');
		this.checkBody = function(key) {
			return new Validator(this, key, this.request.body[key], key in this.request.body);
		};
		this.checkQuery = function(key) {
			return new Validator(this, key, this.request.query[key], key in this.request.query);
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
		this.checkParams = function(key) {
			return new Validator(this, key, this.request.params[key], key in this.request.params);
		};
		yield next;
	};

};


var v = require('validator');

function Validator(context, key, value, exists) {
	debug('validate for %s %s', key, value);
	this.context = context;
	this.key = key;
	this.value = value;
	this.exists = exists;
	//	this.status = 0;
	//this.context.errors = [];
	//this.isNumber = false;
	this.goOn = true;
}

module.exports.Validator = Validator;
//Validators
Validator.prototype.addError = function(tip) {
	this.goOn = false;
	if (!this.context.errors) {
		this.context.errors = [];
	}
	var e = {};
	e[this.key] = tip;
	this.context.errors.push(e);
};
Validator.prototype.optional = function() {
	if (!this.exists) {
		this.goOn = false;
	}
	return this;
};
Validator.prototype.notEmpty = function(tip) {
	if (this.goOn && !this.value) {
		this.addError(tip || this.key + " can not be empty.");
	}
	return this;
};
Validator.prototype.empty = function() {
	if (this.goOn) {
		if (!this.value) {
			this.goOn = false;
		}
	}
	return this;
};
Validator.prototype.match = function(reg, tip) {
	if (this.goOn && !reg.test(this.value)) {
		this.addError(tip || this.key + " is bad format.");
	}
	return this;
};
Validator.prototype.isInt = function(tip) {
	if (this.goOn) {
		if (!v.isInt(this.value)) {
			this.addError(tip || this.key + " is not integer.");
		}
	}
	return this;
};
Validator.prototype.isFloat = function() {
	if (this.goOn) {
		if (!v.isFloat(this.value)) {
			this.addError(tip || this.key + " is not float.");
		}
	}
	return this;
};


Validator.prototype.isLength = function(min, max, tip) {
	if(this.goOn){
		if(!this.value){
			this.addError(tip || this.key +" is empty.");
		}
		max = v.isInt(max)?max:undefined;
		tip = !v.isInt(max)?max:tip;
		if(!v.isLength(this.value , min,max)){
			this.addError(tip || this.key + "'s lenth great than "+min +('undefined'!=typeof max?" and less than "+max+".":"."));
		}
	}
	return this;
};
Validator.prototype.len = Validator.prototype.isLength;
Validator.prototype.in = function(arr, tip) {
	if (this.goOn && arr && -1 == arr.indexOf(this.value)) {
		this.addError(tip || this.key + " must be in [" + arr.join(',') + "].");
	}
	return this;
};
Validator.prototype.eq = function(l, tip) {
	if (this.goOn && this.value != l) {
		this.addError(tip || this.key + " is must equal" + l + ".");
	}
	return this;
};
Validator.prototype.neq = function(l,tip) {
	if (this.goOn && this.value == l) {
		this.addError(tip || this.key + " is must not equal" + l + ".");
	}
	return this;
};
Validator.prototype.contains = function(s,tip) {
	if (this.goOn && !v.contains(s)) {
		this.addError(tip || this.key + " is must contain" + s + ".");
	}
	return this;
};
Validator.prototype.notContains = function(s,tip) {
	if (this.goOn && v.contains(s)) {
		this.addError(tip || this.key + " is must not contain" + s + ".");
	}
	return this;
};
Validator.prototype.isEmail = function(tip) {
	if (this.goOn && !v.isEmail(this.value)) {
		this.addError(tip || this.key + " is not email format.");
	}
	return this;
};
Validator.prototype.isUrl = function(tip) {
	if (this.goOn && !v.isUrl(this.value)) {
		this.addError(tip || this.key + " is not url format.");
	}
	return this;
};
Validator.prototype.isIp = function(tip) {
	if (this.goOn && !v.isIp(this.value)) {
		this.addError(tip || this.key + " is not ip format.");
	}
	return this;
};
Validator.prototype.isAlpha = function(tip) {
	if (this.goOn && !v.isAlpha(this.value)) {
		this.addError(tip || this.key + " is not an alpha string.");
	}
	return this;
};
Validator.prototype.isNumeric = function() {
	if (this.goOn && !v.isNumeric(this.value)) {
		this.addError(tip || this.key + " is  not numeric.");
	}
	return this;
};
Validator.prototype.isAlphanumeric = function(tip) {
	if (this.goOn && !v.isAlphanumeric(this.value)) {
		this.addError(tip || this.key + " is not an alphanumeric string.");
	}
	return this;
};
Validator.prototype.isAlphanumeric = function() {
	if (this.goOn && !v.isAlphanumeric(this.value)) {
		this.addError(tip || this.key + " is not an aphanumeric string.");
	}
	return this;
};
Validator.prototype.isHexadecimal = function() {
	if (this.goOn && !v.isHexadecimal(this.value)) {
		this.addError(tip || this.key + " is not a hexa decimal string.");
	}
	return this;
};
Validator.prototype.isHexColor = function() {
	if (this.goOn && !v.isHexColor(this.value)) {
		this.addError(tip || this.key + " is  not hex color format.");
	}
	return this;
};
Validator.prototype.isLowercase = function() {
	if (this.goOn && !v.isLowercase(this.value)) {
		this.addError(tip || this.key + " is not a lowwer case string");
	}
	return this;
};
Validator.prototype.isUppercase = function() {
	if (this.goOn && !v.isUppercase(this.value)) {
		this.addError(tip || this.key + " is not a upper case string.");
	}
	return this;
};
Validator.prototype.isDivisibleBy = function(n ,tip) {
	if (this.goOn && !v.isDivisibleBy(this.value ,n)) {
		this.addError(tip || this.key + " can not divide by"+n+".");
	}
	return this;
};
Validator.prototype.isNull = function(tip) {
	if (this.goOn && !v.isNull(this.value)) {
		this.addError(tip || this.key + " is not null.");
	}
	return this;
};
Validator.prototype.isByteLength = function(min ,max,tip) {
	if (this.goOn) {
		if(!this.value){
			this.addError(tip || this.key +" is empty.");
		}
		max = v.isInt(max)?max:'undefined';
		tip = !v.isInt(max)?max:tip;
		if(!v.isByteLength(this.value , min,max)){
			this.addError(tip || this.key + "'s byte lenth great than"+min +('undefined'!=typeof max?"and less than "+max+".":"."));
		}
	}
	return this;
};
Validator.prototype.byteLength = Validator.prototype.isByteLength;
Validator.prototype.isUUID = function(tip) {
	if (this.goOn && !v.isUUID(this.value)) {
		this.addError(tip || this.key + " is not UUID format.");
	}
	return this;
};
Validator.prototype.isDate = function(tip) {
	if (this.goOn && !v.isDate(this.value)) {
		this.addError(tip || this.key + " is not date format.");
	}
	return this;
};
Validator.prototype.isTime = function(tip) {
	throw new Error('not implement.')
	//to do

	return this;
};
Validator.prototype.isDatetime = function(tip) {
	throw new Error('not implement.')
	// to do

	return this;
};

Validator.prototype.isAfter = function(d,tip) {
	if (this.goOn && !v.isAfter(this.value ,d)) {
		this.addError(tip || this.key + " must after"+d+".");
	}
	return this;
};
Validator.prototype.isBefore = function(d,tip) {
	if (this.goOn && !v.isBefore(this.value ,d)) {
		this.addError(tip || this.key + " must before"+d+".");
	}
	return this;
};
Validator.prototype.isCreditCard = function(tip) {
	if (this.goOn && !v.isCreditCard(this.value)) {
		this.addError(tip || this.key + " is not credit card format.");
	}
	return this;
};
Validator.prototype.isISBN = function(tip) {
	if (this.goOn && !v.isISBN(this.value)) {
		this.addError(tip || this.key + " is not ISBN format.");
	}
	return this;
};
Validator.prototype.isJSON = function(tip) {
	if (this.goOn && !v.isJSON(this.value)) {
		this.addError(tip || this.key + " is not json format.");
	}
	return this;
};

Validator.prototype.isMultibyte = function(tip) {
	if (this.goOn && !v.isMultibyte(this.value)) {
		this.addError(tip || this.key + " is not a multibyte string.");
	}
	return this;
};
Validator.prototype.isAscii = function(tip) {
	if (this.goOn && !v.isAscii(this.value)) {
		this.addError(tip || this.key + " is not a ascii string.");
	}
	return this;
};
Validator.prototype.isFullWidth = function(tip) {
	if (this.goOn && !v.isFullWidth(this.value)) {
		this.addError(tip || this.key + " is not a full width string.");
	}
	return this;
};
Validator.prototype.isHalfWidth = function(tip) {
	if (this.goOn && !v.isHalfWidth(this.value)) {
		this.addError(tip || this.key + " is not a half width string.");
	}
	return this;
};
Validator.prototype.isVariableWidth = function(tip) {
	if (this.goOn && !v.isVariableWidth(this.value)) {
		this.addError(tip || this.key + " is not a variable width string.");
	}
	return this;
};
Validator.prototype.isSurrogatePair = function(tip) {
	if (this.goOn && !v.isSurrogatePair(this.value)) {
		this.addError(tip || this.key + " is not a surrogate pair string.");
	}
	return this;
};


//Sanitizers

Validator.prototype.toString = function() {

};
Validator.prototype.toDate = function() {

};
Validator.prototype.toInt = function() {

};
Validator.prototype.toFloat = function() {

};
Validator.prototype.toBoolean = function() {

};
Validator.prototype.trim = function() {

};
Validator.prototype.ltrim = function() {

};
Validator.prototype.rtrim = function() {

};
Validator.prototype.escape = function() {

};
Validator.prototype.stripLow = function() {

};
Validator.prototype.whitelist = function() {

};
Validator.prototype.blacklist = function() {

};
Validator.prototype.dexss = function() {

};
Validator.prototype.dexss = function() {

};