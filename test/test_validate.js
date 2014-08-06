'use strict';

var koa = require('koa'),
request = require('supertest');

function create_app(){
	var app = koa();
	app.use(require('koa-body')());
	app.use(require('../lib/validate.js')());
	app.use(require('koa-router')(app));
	return app;
}

// describe('koa-validate' , function(){
// 	it("optional should be to ok" , function(done){

// 		var app = create_app();
// 		app.post('/',function*(){
// 			this.checkBody('name').optional();
// 			if(this.errors){
// 				return this.throw(500); 
// 			}
// 		});
// 		request(app.listen())
// 		.post('/')
// 		.send({name:"jim"})
// 		.expect(200)
// 		.end(done);
		
// 	});
// });


var app = create_app();
	app.post('/',function*(){
		return this.body = "hahah";
		this.checkBody('name').optional();
		if(this.errors){
			return this.throw(500); 
		}
	});
	app.listen();



