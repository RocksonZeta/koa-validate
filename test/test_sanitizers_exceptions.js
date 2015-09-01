'use strict';

var koa = require('koa'),
request = require('supertest');
require('should');


function create_app(){
	var app = koa();
	app.use(require('koa-body')());
	app.use(require('../lib/validate.js')());
	app.use(require('koa-router')(app));
	return app;
}

describe('koa-validate' , function(){
	it("bad uri decodeURIComponent should not to be ok" , function(done){
		var app = create_app();
		app.post('/decodeURIComponent',function*(){
			this.checkBody('uri').decodeURIComponent();
			if(this.errors) {
				this.status=500;
			}else{
				this.status=200;
			}
		});
		var req = request(app.listen());
		req.post('/decodeURIComponent')
		.send({uri:"%"})
		.expect(500 , done);
	});
	it("bad uri decodeURI should not to be ok" , function(done){
		var app = create_app();
		app.post('/decodeURI',function*(){
			this.checkBody('uri').decodeURI();
			if(this.errors) {
				this.status=500;
			}else{
				this.status=200;
			}
		});
		var req = request(app.listen());
		req.post('/decodeURI')
		.send({uri:"%"})
		.expect(500 , done);
	});
	it("bad base64 string should not to be ok" , function(done){
		var app = create_app();
		app.post('/decodeBase64',function*(){
			this.checkBody('base64').decodeURIComponent();
			if(this.errors) {
				this.status=500;
			}else{
				this.status=200;
			}
		});
		var req = request(app.listen());
		req.post('/decodeBase64')
		.send({base64:"%%"})
		.expect(500 , done);
	});
	it("bad int string should not to be ok" , function(done){
		var app = create_app();
		app.post('/toInt',function*(){
			this.checkBody('v').toInt();
			if(this.errors) {
				this.status=500;
			}else{
				this.status=200;
			}
		});
		var req = request(app.listen());
		req.post('/toInt')
		.send({v:"gg"})
		.expect(500 , done);
	});

	it("0 len should be ok" , function(done){
		var app = create_app();
		app.post('/len',function*(){
			this.checkBody('v').len(0,1);
			if(this.errors) {
				this.status=500;
			}else{
				this.status=200;
			}
		});
		var req = request(app.listen());
		req.post('/len')
		.send({v:""})
		.expect(200 , done);
	});
});