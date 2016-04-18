'use strict';

var koa = require('koa'),
request = require('supertest'),
appFactory = require('./appFactory.js');
require('should');



describe('koa-validate' , function(){
	// this.timeout(100000);
	it("file check ok" , function(done){
		var app = appFactory.create(1);
		app.router.post('/upload',function*(){
			this.checkFile('empty').empty();
			// this.checkFile('file1').empty().contentTypeMatch(/^text/);
			this.checkFile('file').empty().contentTypeMatch(/^application\//);
			yield this.checkFile('file1').empty().move(__dirname+"/temp", function(file , context){
			});
			this.checkFile('file').notEmpty();
			yield this.checkFile('file').notEmpty().copy(__dirname+"/tempdir/" , function(file , context){
			});
			yield this.checkFile('file').notEmpty().copy(__dirname);
			yield this.checkFile('file').notEmpty().copy(function(){return __dirname+"/temp"});
			yield (yield this.checkFile('file').notEmpty().fileNameMatch(/^.*.js$/).size(0,10*1024).suffixIn(['js']).copy(function*(obj){
				return __dirname+"/temp";
			})).delete();
			require('fs').unlinkSync(__dirname+'/temp');
			require('fs').unlinkSync(__dirname+'/'+require('path').basename(this.request.body.files.file.path));
			require('fs').unlinkSync(__dirname+'/tempdir/'+require('path').basename(this.request.body.files.file.path));
			// require('fs').unlinkSync(__dirname+'/tempdir');
			if(this.errors){
				this.body = this.errors;
				return;
			}
			this.body = 'ok';
		});

		request(app.listen())
		.post('/upload')
		.attach('file',__dirname+"/test_checkFile.js")
		.attach('file1',__dirname+"/test_checkFile.js")
		// .attach('file2',__dirname+"/test_checkFile.js")
		.send({type:"js"})
		.expect(200)
		.expect('ok' , done);
	});

	it("file check not ok" , function(done){
		var app = appFactory.create(1);
		app.router.post('/upload',function*(){
			this.checkFile('empty').notEmpty();
			this.checkFile('file0').size(10,10 );
			this.checkFile('file').size(1024*100,1024*1024*10 );
			this.checkFile('file1').size(1024*100,1024*1024*1024*10 );
			this.checkFile('file2').suffixIn(['png']);
			this.checkFile('file3').contentTypeMatch(/^image\/.*$/);
			this.checkFile('file4').contentTypeMatch(/^image\/.*$/);
			this.checkFile('file5').fileNameMatch(/\.png$/);
			this.checkFile('file6').isImageContentType("not image content type.");


			if(9 === this.errors.length){
				this.body = 'ok';
				return ;
			}else{
				this.body = 'not ok';
				return ;
			}

		});

		request(app.listen())
		.post('/upload')
		.attach('file',__dirname+"/test_checkFile.js")
		.attach('file0',__dirname+"/test_checkFile.js")
		.attach('file1',__dirname+"/test_checkFile.js")
		.attach('file2',__dirname+"/test_checkFile.js")
		.attach('file3',__dirname+"/test_checkFile.js")
		.attach('file4',__dirname+"/test_checkFile.js")
		.attach('file5',__dirname+"/test_checkFile.js")
		.attach('file5',__dirname+"/test_checkFile.js")
		.attach('file6',__dirname+"/test_checkFile.js")
		.send({type:"js"})
		.expect(200)
		.expect('ok' , done);
	});
});