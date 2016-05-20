'use strict';

var data = {
  store: {
    book: [
      { category: "reference",
        author: "Nigel Rees",
        title: "Sayings of the Century",
        price: 8.95,
        publishDate:"2015-01-01",
        disabled:false
      },
      { category: "fiction",
        author: "Evelyn Waugh",
        title: "Sword of Honour",
        price: 12.99
      },
      { category: "fiction",
        author: "Herman Melville",
        title: "Moby Dick",
        isbn: "0-553-21311-3",
        price: 8.99
      },
      { category: "fiction",
        author: "J. R. R. Tolkien",
        title: "The Lord of the Rings",
        isbn: "0-395-19395-8",
        price: 22.99
      }
    ],
    bicycle: {
      color: "red",
      price: 19.95
    }
  }
};



var koa = require('koa'),
request = require('supertest'),
appFactory = require('./appFactory.js');
require('should');

describe('koa-validate' , function(){
	it("json path basic" , function(done){
		var app = appFactory.create(1);
		app.router.post('/json',function*(){
			this.checkBody('/', true).notEmpty();
      this.checkBody('/store/bicycle/color', true).exist()
      this.checkBody('/store/book[0]/price', true).get(0).eq(8.95);
      this.checkBody('/store/book[0]/price', true).get(0).isFloat().eq(8.95);
			this.checkBody('/store/book[0]/disabled', true).first().notEmpty().toBoolean()
			this.checkBody('#/store/book[0]/category', true).first().trim().eq('reference');
			this.checkBody('/store/book[*]/price', true).filter(function(v,k,o){
				return v>10
			}).first().gt(10)
			if(this.errors) {
        // console.log(this.errors)
				this.status=500;
			}else{
				this.status=200;
			}
		});
		var req = request(app.listen());
		req.post('/json')
		.send(data)
		.expect(200 , done);
	});

});

describe('koa-validate type' , function(){
  it("type check" , function(done){
    var app = appFactory.create(1);
    app.router.post('/json',function*(){
      this.checkBody('/', true).notEmpty();
      this.checkBody('/store/book[0]/price', true).get(0).type('number').type("primitive")
      this.checkBody('/store/book[0]/price', true).get(0).type('hello') // should warn
      this.checkBody('#/store/book[0]/category', true).first().type('string');
      this.checkBody('/store/book[*]/price', true).type('array')
      this.checkBody('/store/book[0]/publishDate', true).get(0).toDate().type('date').type('object')
      if(this.errors) {
        this.status=500;
      }else{
        this.status=200;
      }
    });
    var req = request(app.listen());
    req.post('/json')
    .send(data)
    .expect(200 , done);
  });
it("type fail check" , function(done){
    var app = appFactory.create(1);
    app.router.post('/json',function*(){
      this.checkBody('/', true).type('null');
      this.checkBody('/store/book[0]/price', true).get(0).type('string');
      this.checkBody('#/store/book[0]/category', true).first().type('null');
      this.checkBody('/store/book[*]/price', true).type('nullorundefined')
      this.checkBody('/store/book[0]/publishDate', true).first().toDate().type('array')
      // console.log(this.errors)
      if(this.errors && 5==this.errors.length) {
        this.status=200;
      }else{
        this.status=500;
      }
    });
    var req = request(app.listen());
    req.post('/json')
    .send(data)
    .expect(200 , done);
  });
});
