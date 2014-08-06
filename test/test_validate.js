'use strict';

var koa = require('koa'),
 http     = require('http'),
request = require('supertest');


function create_app(){
	var app = koa();
	app.use(require('koa-body')());
	app.use(require('../lib/validate.js')());
	app.use(require('koa-router')(app));
	return app;
}

describe('koa-validate' , function(){
	it("these validates should be to ok" , function(done){
		var app = create_app();
		app.post('/signin',function*(){
			this.checkBody('name').optional().len(3,20);
			this.checkBody('email').isEmail();
			this.checkBody('password').notEmpty().len(3,20);
			this.checkBody('nick').optional().empty().len(3,20);
			if(this.errors){
				return this.body = this.errors;
			}
			this.body= 'ok';
		});
		var req = request(app.listen());

		req.post('/signin')
		.send({name:"jim",email:"jim@gmail.com",password:"tom",nick:"0"})
		.expect(200)
		.expect('ok' ,done);
		
	});
});


