'use strict';

var koa = require('koa'),
request = require('supertest');
require('should');


function create_app(){
	var app = koa();
	// app.use(require('koa-body')({multipart:true , formidable:{keepExtensions:true}}));
	app.use(require('../lib/validate.js')());
	app.use(require('koa-router')(app));
	return app;
}

describe('koa-validate' , function(){
	it("nobody to check" , function(done){
		var app = create_app();
		app.post('/nobody',function*(){
			this.checkBody('body').notEmpty();
			if(this.errors) {
				this.status=500;
			}else{
				this.status=200;
			}
		});
		var req = request(app.listen());
		req.post('/nobody')
		.send({body:"no"})
		.expect(500 , done);
	});

});