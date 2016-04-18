'use strict';

var koa = require('koa'),
request = require('supertest'),
appFactory = require('./appFactory.js');
require('should');

describe('koa-validate' , function(){
	it("nobody to check" , function(done){
		var app = appFactory.create(1);
		app.router.post('/nobody',function*(){
			this.checkBody('body').notEmpty();
			if(this.errors) {
				this.status=500;
			}else{
				this.status=200;
			}
		});
		var req = request(app.listen());
		req.post('/nobody')
		.send()
		.expect(500 , done);
	});

});