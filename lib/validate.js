'use strict';
var debug = require('debug')('koa-validate');

module.exports = function(opt) {
	debug('use koa-validate');
	var opt = opt || {};

	return function * (next) {
		debug('init koa-validate');
		this.checkBody = function(key) {
			return new Validator(this, key, this.request.body[key], key in this.request.body , this.request.body );
		};
		this.checkQuery = function(key) {
			return new Validator(this, key, this.request.query[key], key in this.request.query,this.request.query );
		};
		this.checkParams = function(key) {
			return new Validator(this, key, this.params[key], key in this.params,this.params);
		};
		yield next;
	};

};


var v = require('validator');

function Validator(context, key, value, exists, params) {
	debug('validate for %s %s', key, value);
	this.params = params;
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
	debug('validate for %s %s failed.',this.key, this.value);
	this.goOn = false;
	if (!this.context.errors) {
		this.context.errors = [];
	}
	var e = {};
	e[this.key] = tip;
	this.context.errors.push(e);
};

Validator.prototype.hasError = function() {
	return this.context.errors && this.context.errors.length > 0 ? true : false;
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
	if (this.goOn&& !v.isInt(this.value)) {
		this.addError(tip || this.key + " is not integer.");
	}
	return this;
};
Validator.prototype.isFloat = function(tip) {
	if (this.goOn && !v.isFloat(this.value)) {
		this.addError(tip || this.key + " is not float.");
	}
	return this;
};


Validator.prototype.isLength = function(min, max, tip) {
	if (this.goOn) {
		if (!this.value) {
			this.addError(tip || this.key + " is empty.");
		}
		min = min || 0;
		max = v.isInt(max) ? max : Number.MAX_VALUE;
		tip = !v.isInt(max) ? max : tip;
		if (this.value.length<min || this.value.length>max) {
			this.addError(tip || this.key + "'s lenth great than " + min + ('undefined' != typeof max ? " and less than " + max + "." : "."));
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
Validator.prototype.isIn = Validator.prototype.in;
Validator.prototype.eq = function(l, tip) {
	if (this.goOn && this.value != l) {
		this.addError(tip || this.key + " is must equal " + l + ".");
	}
	return this;
};
Validator.prototype.neq = function(l, tip) {
	if (this.goOn && this.value == l) {
		this.addError(tip || this.key + " is must not equal " + l + ".");
	}
	return this;
};
Validator.prototype.contains = function(s, tip) {
	if (this.goOn && !v.contains(this.value,s)) {
		this.addError(tip || this.key + " is must contain " + s + ".");
	}
	return this;
};
Validator.prototype.notContains = function(s, tip) {
	if (this.goOn && v.contains(this.value,s)) {
		this.addError(tip || this.key + " is must not contain " + s + ".");
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
	if (this.goOn && !v.isURL(this.value)) {
		this.addError(tip || this.key + " is not url format.");
	}
	return this;
};
Validator.prototype.isIp = function(tip) {
	if (this.goOn && !v.isIP(this.value)) {
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
Validator.prototype.isNumeric = function(tip) {
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
Validator.prototype.isAlphanumeric = function(tip) {
	if (this.goOn && !v.isAlphanumeric(this.value)) {
		this.addError(tip || this.key + " is not an aphanumeric string.");
	}
	return this;
};
Validator.prototype.isBase64 = function(tip) {
	if (this.goOn && !v.isBase64(this.value)) {
		this.addError(tip || this.key + " is not a base64 string.");
	}
	return this;
};
Validator.prototype.isHexadecimal = function(tip) {
	if (this.goOn && !v.isHexadecimal(this.value)) {
		this.addError(tip || this.key + " is not a hexa decimal string.");
	}
	return this;
};
Validator.prototype.isHexColor = function(tip) {
	if (this.goOn && !v.isHexColor(this.value)) {
		this.addError(tip || this.key + " is  not hex color format.");
	}
	return this;
};
Validator.prototype.isLowercase = function(tip) {
	if (this.goOn && !v.isLowercase(this.value)) {
		this.addError(tip || this.key + " is not a lowwer case string");
	}
	return this;
};
Validator.prototype.isUppercase = function(tip) {
	if (this.goOn && !v.isUppercase(this.value)) {
		this.addError(tip || this.key + " is not a upper case string.");
	}
	return this;
};
Validator.prototype.isDivisibleBy = function(n, tip) {
	if (this.goOn && !v.isDivisibleBy(this.value, n)) {
		this.addError(tip || this.key + " can not divide by" + n + ".");
	}
	return this;
};
Validator.prototype.isNull = function(tip) {
	if (this.goOn && !v.isNull(this.value)) {
		this.addError(tip || this.key + " is not null.");
	}
	return this;
};
Validator.prototype.isByteLength = function(min, max,charset,tip) {
	if (this.goOn) {
		if (!this.value) {
			this.addError(tip || this.key + " is empty.");
		}
		min = min || 0;
		max = max || Number.MAX_VALUE;
		charset = charset||'utf8';
		var bl = Buffer.byteLength(this.value , charset);
		tip = !v.isInt(max) ? max : tip;
		if (bl<min || bl>max) {
			this.addError(tip || this.key + "'s byte lenth great than " + min +" and less than " + max + "." );
		}
	}
	return this;
};
Validator.prototype.byteLength = Validator.prototype.isByteLength;
Validator.prototype.isUUID = function(ver,tip) {
	if (this.goOn && !v.isUUID(this.value,ver)) {
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

Validator.prototype.isAfter = function(d, tip) {
	if (this.goOn && !v.isAfter(this.value, d)) {
		this.addError(tip || this.key + " must after " + d + ".");
	}
	return this;
};
Validator.prototype.isBefore = function(d, tip) {
	if (this.goOn && !v.isBefore(this.value, d)) {
		this.addError(tip || this.key + " must before " + d + ".");
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
Validator.prototype.toDate = function() {
	this.isDate();
	if (!this.hasError()) {
		this.params[this.key] = v.toDate(this.value);
	}
	return this;
};
Validator.prototype.toInt = function() {
	this.isInt();
	if (!this.hasError()) {
		this.params[this.key] = v.toInt(this.value);
	}
	return this;
};
Validator.prototype.toFloat = function() {
	this.isFloat();
	if (!this.hasError()) {
		this.params[this.key] = v.toFloat(this.value);
	}
	return this;
};
Validator.prototype.toBoolean = function() {
	if (!this.hasError()&&this.value) {
		this.params[this.key] = v.toBoolean(this.value);
	}
	return this;
};
Validator.prototype.toLowercase = function() {
	if (!this.hasError()&&this.value) {
		this.params[this.key] = this.value.toLowerCase();
	}
	return this;
};
Validator.prototype.toLow = Validator.prototype.toLowercase;
Validator.prototype.toUppercase = function() {
	if (!this.hasError()&&this.value) {
		this.params[this.key] = this.value.toUpperCase();
	}
	return this;
};
Validator.prototype.toUp = Validator.prototype.toUppercase ;
Validator.prototype.toBoolean = function() {
	if (!this.hasError()&&this.value) {
		this.params[this.key] = v.toBoolean(this.value);
	}
	return this;
};
Validator.prototype.trim = function(c) {
	if (!this.hasError()) {
		this.params[this.key] = v.trim(this.value,c);
	}
	return this;
};
Validator.prototype.ltrim = function(c) {
	if (!this.hasError()) {
		this.params[this.key] = v.ltrim(this.value,c);
	}
};
Validator.prototype.rtrim = function(c) {
	if (!this.hasError()) {
		this.params[this.key] = v.rtrim(this.value,c);
	}
	return this;
};
Validator.prototype.escape = function() {
	if (!this.hasError()) {
		this.params[this.key] = v.escape(this.value);
	}
	return this;
};
Validator.prototype.stripLow = function(nl) {
	if (!this.hasError()) {
		this.params[this.key] = v.stripLow(this.value, nl);
	}
	return this;
};
Validator.prototype.whitelist = function(s) {
	if (!this.hasError()) {
		this.params[this.key] = v.whitelist(this.value,s);
	}
	return this;
};
Validator.prototype.blacklist = function(s) {
	if (!this.hasError()) {
		this.params[this.key] = v.blacklist(this.value,s);
	}
	return this;
};

Validator.prototype.dexss = function() {
	throw new Error('not implemented.');
	//return this;
};