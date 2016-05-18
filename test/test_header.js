'use strict';

var koa = require('koa'),
request = require('supertest'),
appFactory = require('./appFactory.js');
require('should');

describe('koa-validate' , function(){
	it("check header" , function(done){
		var app = appFactory.create(1);
		app.router.get('/header',function*(){
			this.checkHeader('int').notEmpty().isInt();
			if(this.errors) {
				this.status=500;
			}else{
				this.status=200;
			}
		});
		request(app.listen())
		.get('/header')
		.set('int', "1")
		.query().expect(200,done);
	});

});