'use strict';

var koa = require('koa'),
request = require('supertest'),
appFactory = require('./appFactory.js');
require('should');



describe('koa-validate' , function(){
	it("bad uri decodeURIComponent should not to be ok" , function(done){
		var app = appFactory.create(1);
		app.router.post('/decodeURIComponent',function*(){
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
		var app = appFactory.create(1);
		app.router.post('/decodeURI',function*(){
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
		var app = appFactory.create(1);
		app.router.post('/decodeBase64',function*(){
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
		var app = appFactory.create(1);
		app.router.post('/toInt',function*(){
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
		var app = appFactory.create(1);
		app.router.post('/len',function*(){
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