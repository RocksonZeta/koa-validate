'use strict';

var koa = require('koa'),
request = require('supertest'),
appFactory = require('./appFactory.js');
require('should');

describe('koa-validate' , function(){
	it("these validates should be to ok" , function(done){
		var app = appFactory.create(1);
		app.router.post('/validate',function*(){
			this.checkBody('optional').optional().len(3,20);
			this.checkBody('optional').optional().len(1, 100).trim().toInt()
			this.checkBody('optionalInt').optional().len(1, 100).trim().toInt()
			this.checkBody('name').notEmpty().len(3,20);
			this.checkBody('empty').empty();
			this.checkBody('notBlank').notBlank();
			this.checkBody('match').match(/^abc$/i);
			this.checkBody('notMatch').notMatch(/^xyz$/i);
			this.checkBody('ensure').ensure(true);
			this.checkBody('ensureNot').ensureNot(false);
			this.checkBody('integer').isInt();
			this.checkBody('integer').isInt(null, {min:12});
			this.checkBody('integer').isInt(null, {max:12});
			this.checkBody('integer').isInt(null, {min:12,max:12});
			this.checkBody('stringInteger').isInt();
			this.checkBody('stringInteger').isInt(null, {min:12});
			this.checkBody('stringInteger').isInt(null, {max:12});
			this.checkBody('stringInteger').isInt(null, {min:12,max:12});
			this.checkBody('float_').isFloat();
			this.checkBody('in').in([1,2]);
			this.checkBody('eq').eq("eq");
			this.checkBody('neq').neq("eq");
			this.checkBody('number4').gt(3);
			this.checkBody('number4').lt(5);
			this.checkBody('number4').ge(4);
			this.checkBody('number4').le(4);
			this.checkBody('number4').ge(3);
			this.checkBody('number4').le(5);
			this.checkBody('contains').contains("tain");
			this.checkBody('notContains').notContains(" ");
			this.checkBody('email').isEmail();
			this.checkBody('url').isUrl();
			this.checkBody('ip').isIp();
			this.checkBody('alpha').isAlpha();
			this.checkBody('numeric').isNumeric();
			this.checkBody('an').isAlphanumeric();
			this.checkBody('base64').isBase64();
			this.checkBody('hex').isHexadecimal();
			this.checkBody('color1').isHexColor();
			this.checkBody('color2').isHexColor();
			this.checkBody('color3').isHexColor();
			this.checkBody('color4').isHexColor();
			this.checkBody('low').isLowercase();
			this.checkBody('up').isUppercase();
			this.checkBody('div').isDivisibleBy(3);
			this.checkBody('n').isNull();
			this.checkBody('len').isLength(1,4);
			this.checkBody('byteLenght').isByteLength(4,6);
			this.checkBody('uuid').isUUID();
			this.checkBody('date').isDate();
			this.checkBody('time').isTime();
			this.checkBody('after').isAfter("2014-08-06");
			this.checkBody('before').isBefore("2014-08-08");
			this.checkBody('in').isIn();
			this.checkBody('credit').isCreditCard();
			this.checkBody('isbn').isISBN();
			this.checkBody('json').isJSON();
			this.checkBody('mb').isMultibyte();
			this.checkBody('ascii').isAscii();
			this.checkBody('fw').isFullWidth();
			this.checkBody('hw').isHalfWidth();
			this.checkBody('vw').isVariableWidth();
			this.checkBody('sp').isSurrogatePair();
			this.checkBody('currency').isCurrency();
			this.checkBody('dataUri').isDataURI();
			this.checkBody('mobilePhone').isMobilePhone(null,"zh-CN");
			this.checkBody('iso8601').isISO8601();
			this.checkBody('mac').isMACAddress();
			this.checkBody('isin').isISIN();
			this.checkBody('fqdn').isFQDN();
			if(this.errors){
				this.body = this.errors;
				 return;
			}
			if(8 !== this.request.body.age){
				this.body= 'failed';
			}
			this.body= 'ok';
		});
		var req = request(app.listen());

		req.post('/validate')
		.send({
			optionalInt:"100",
			name:"jim",
			empty:"",
			notBlank:"\t h\n",
			email:"jim@gmail.com",
			len:"len",
			match:"abc",
			notMmatch:"abc",
			ensure:"",
			ensureNot:"",
			integer:12,
			stringInteger:"12",
			float_:1.23,
			in:1,
			eq:"eq",
			neq:'neq',
			number4:'4',
			contains:"contains",
			notContains:"notContains",
			url:"http://www.google.com",
			ip:'192.168.1.1',
			alpha:"abxyABXZ",
			numeric:"3243134",
			an:"a1b2c3",
			base64:"aGVsbG8=",
			hex:"0a1b2c3ef",
			color1:"#ffffff",
			color2:"ffffff",
			color3:"#fff",
			color4:"fff",
			low:"hello",
			up:"HELLO",
			div:"21",
			n:"",
			byteLenght:"你好",
			uuid:"c8162b90-fdda-4803-843b-ed5851480c86",
			time:"13:12:00",
			date:"2014-08-07",
			after:"2014-08-07",
			before:"2014-08-07",
			credit:"4063651340421805",
			isbn:"9787513300711",
			json:'{"a":1}',
			mb:"多字节",
			ascii:"fff",
			fw:"宽字节",
			hw:"a字节",
			vw:"v多字节",
			sp:'ABC千𥧄1-2-3',
			currency:"$12",
			dataUri:"data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E",
			mobilePhone:"13800000000",
			iso8601:"2004-05-03",
			mac:"C8:3A:35:CC:ED:80",
			isin:"US0378331005",
			fqdn:"www.google.com",
		})
		.expect(200)
		.expect('ok' ,done);
	});

	it("these validates fail tests should be to ok" , function(done){
		var app = appFactory.create();
		app.router.post('/validate',function*(){
			this.checkBody('name').notEmpty().len(3,20);
			this.checkBody('notEmpty').notEmpty();
			this.checkBody('blank').notBlank();
			this.checkBody('notEmpty').len(2,3);
			this.checkBody('match').match(/^abc$/i);
			this.checkBody('integer').isInt();
			this.checkBody('integer2').isInt(null, {min:101});
			this.checkBody('integer2').isInt(null, {max:99});
			this.checkBody('integer2').isInt(null, {min:1,max:99});
			this.checkBody('float_').isFloat();
			this.checkBody('in').in([1,2]);
			this.checkBody('eq').eq("eq");
			this.checkBody('neq').neq("eq");
			this.checkBody('number4').gt(5);
			this.checkBody('number4').lt(3);
			this.checkBody('number4').ge(5);
			this.checkBody('number4').le(3);
			this.checkBody('contains').contains("tain");
			this.checkBody('notContains').notContains(" ");
			this.checkBody('email').isEmail();
			this.checkBody('url').isUrl();
			this.checkBody('ip').isIp();
			this.checkBody('alpha').isAlpha();
			this.checkBody('numeric').isNumeric();
			this.checkBody('an').isAlphanumeric();
			this.checkBody('base64').isBase64();
			this.checkBody('hex').isHexadecimal();
			this.checkBody('color1').isHexColor();
			this.checkBody('color2').isHexColor();
			this.checkBody('color3').isHexColor();
			this.checkBody('color4').isHexColor();
			this.checkBody('low').isLowercase();
			this.checkBody('up').isUppercase();
			this.checkBody('div').isDivisibleBy(3);
			this.checkBody('n').isNull();
			this.checkBody('len').isLength(3,4);
			this.checkBody('len1').isLength(3,4);
			this.checkBody('byteLength').isByteLength(4,6);
			this.checkBody('uuid').isUUID();
			this.checkBody('time').isTime();
			this.checkBody('date').isDate();
			this.checkBody('after').isAfter("2014-08-06");
			this.checkBody('before').isBefore("2014-08-02");
			this.checkBody('in').isIn([1,2]);
			this.checkBody('credit').isCreditCard();
			this.checkBody('isbn').isISBN();
			this.checkBody('json').isJSON();
			this.checkBody('mb').isMultibyte();
			this.checkBody('ascii').isAscii();
			this.checkBody('fw').isFullWidth();
			this.checkBody('hw').isHalfWidth();
			this.checkBody('vw').isVariableWidth();
			this.checkBody('sp').isSurrogatePair();
			this.checkBody('currency').isCurrency();
			this.checkBody('dataUri').isDataURI();
			this.checkBody('mobilePhone').isMobilePhone(null,"zh-CN");
			this.checkBody('iso8601').isISO8601();
			this.checkBody('mac').isMACAddress();
			this.checkBody('isin').isISIN();
			this.checkBody('fqdn').isFQDN();
			this.checkBody('fqdn1').isFQDN();
			if(this.errors.length === 61){
				this.body = this.errors;
				this.body = 'ok';
				return ;
			}
			this.body= 'only '+this.errors.length+' errors';
		});
		var req = request(app.listen());

		req.post('/validate')
		.send({
			name:"j",
			empty:"fd",
			blank:" \n\r\f\t ",
			email:"jim@@gmail.com",
			len:"l",
			len1:"length1",
			match:"xyz",
			integer:"12a",
			integer2:"100",
			float_:'a1.23',
			in:'fd',
			eq:"neq",
			neq:'eq',
			number4:'4',
			contains:"hello" , 
			notContains:"h f",
			url:"google",
			ip:'192.168.',
			alpha:"321",
			numeric:"fada",
			an:"__a",
			base64:"fdsaf",
			hex:"hgsr",
			color1:"#fffff",
			color2:"fffff",
			color3:"#ff",
			color4:"ff",
			low:"Hre",
			up:"re",
			div:"22",
			n:"f",
			byteLength:"你",
			uuid:"c8162b90-fdda-4803-843bed5851480c86",
			date:"2014-0807",
			time:"24:00:00",
			after:"2014-08-05",
			before:"2014-08-02",
			credit:"4063651340421805332",
			isbn:"978751330071154",
			json:'{"a:1}',
			mb:"fd",
			ascii:"你好",
			fw:"43",
			hw:"你好",
			vw:"aa",
			sp:'fdfd',
			currency:"#12",
			dataUri:"hello world",
			mobilePhone:"12000000000",
			iso8601:"2004503",
			mac:"C8:3A:35:CC:ED:8Z",
			isin:"hello",
			fqdn:"http://www.x.com",
		})
		.expect(200)
		.expect('ok' ,done);
	});
	
	it('there validate query should be to okay' , function(done){
		var app = appFactory.create();
		app.router.get('/query',function*(){
			this.checkQuery('name').notEmpty();
			this.checkQuery('password').len(3,20);
			if(this.errors){
				this.body = this.errors;
				 return;
			}
			this.body = 'ok';
		});
		request(app.listen())
		.get('/query')
		.query({
			name:'jim',
			password:'yeap'
		}).expect(200)
		.expect('ok' , done);
	});
	it('there validate params should be to okay' , function(done){
		var app = appFactory.create();
		app.router.get('/:id',function*(){
			this.checkParams('id').isInt();
			if(this.errors){
				this.body = this.errors;
				 return;
			}
			this.body = 'ok';
		});
		request(app.listen())
		.get('/123')
		.expect(200)
		.expect('ok' , done);
	});
	it('there sanitizers should be to okay' , function(done){
		var url ="http://www.google.com/"
		var app = appFactory.create(1);
		app.router.post('/sanitizers',function*(){
			this.checkBody('default').default('default');
			this.checkBody('int_').toInt();
			this.checkBody('int_').toInt(null, 10, {min:20});
			this.checkBody('int_').toInt(null, 10, {max:20});
			this.checkBody('int_').toInt(null, 10, {min:20,max:20});
			this.checkBody('octal_').toInt(null, 8);
			this.checkBody('octal_').toInt(null, 8, {min:8});
			this.checkBody('octal_').toInt(null, 8, {max:8});
			this.checkBody('octal_').toInt(null, 8, {min:8,max:8});
			this.checkBody('float_').toFloat();
			this.checkBody('bool').toBoolean();
			this.checkBody('falseValue').notEmpty('value is empty').toBoolean();
			this.checkBody('date').toDate();
			this.checkBody('trim').trim();
			this.checkBody('ltrim').ltrim();
			this.checkBody('rtrim').rtrim();
			this.checkBody('up').toUp();
			this.checkBody('low').toLow();
			this.checkBody('escape').escape();
			this.checkBody('stripLow').stripLow();
			this.checkBody('whitelist').whitelist('ll');
			this.checkBody('blacklist').blacklist('ll');
			this.checkBody('encodeURI').decodeURI();
			this.checkBody('decodeURI').encodeURI();
			this.checkBody('encodeURIComponent').decodeURIComponent();
			this.checkBody('decodeURIComponent').encodeURIComponent();
			this.checkBody('rep').replace(',' ,'');
			this.checkBody('base64').clone('base64Buffer').decodeBase64(true);
			this.checkBody('base64').decodeBase64();
			this.checkBody('debase64').encodeBase64();
			this.checkBody('hash').clone('md5').md5();
			this.checkBody('hash').clone('sha1').sha1();
			this.checkBody('hash').clone('num1' ,1);
			this.checkBody('json').toJson();
			//console.log(this.request.body)
			if(this.errors){
				this.body = this.errors;
				 return;
			}
			var body = this.request.body;
			if('default' != body.default){
				this.throw(500);
			}
			if(20 !== body.int_ ){
				this.throw(500);
			}
			if(8 !== body.octal_ ){
				this.throw(500);
			}
			if(1.2 !== body.float_ ){
				this.throw(500);
			}
			if(true!== body.bool ){
				this.throw(500);
			}
			if(false!== body.falseValue ){
				this.throw(500);
			}
			if(new Date('2014-01-01').getTime() !== body.date.getTime() ){
				this.throw(500);
			}

			if('jim'!=body.trim){
				this.throw(500);
			}
			if('jim '!=body.ltrim){
				this.throw(500);
			}
			if(' jim'!=body.rtrim){
				this.throw(500);
			}
			if('JIM'!=body.up){
				this.throw(500);
			}
			if('jim'!=body.low){
				this.throw(500);
			}
			if('&lt;div&gt;'!=body.escape){
				this.throw(500);
			}
			if('abc'!=body.stripLow){
				this.throw(500);
			}
			if('ll'!=body.whitelist){
				this.throw(500);
			}
			if('heo'!=body.blacklist){
				this.throw(500);
			}
			if(encodeURI(url)!=body.decodeURI){
				this.throw(500);
			}
			if(decodeURI(url)!=body.encodeURI){
				this.throw(500);
			}
			if(encodeURIComponent(url)!=body.decodeURIComponent){
				this.throw(500);
			}
			if(decodeURIComponent(url)!=body.encodeURIComponent){
				this.throw(500);
			}
			if('ab'!=body.rep){
				this.throw(500);
			}
			if("hello"!=body.base64){
				this.throw(500);
			}
			if('aGVsbG8='!=body.debase64){
				this.throw(500);
			}
			'hello'.should.equal(body.base64Buffer.toString());
			body.md5.should.equal('5d41402abc4b2a76b9719d911017c592');
			if('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d'!=body.sha1){
				this.throw(500);
			}
			if(1!=body.num1){
				this.throw(500);
			}
			if(1!=body.json.a){
				this.throw(500);
			}
			this.body = 'ok';
		});
		request(app.listen())
		.post('/sanitizers')
		.send({
			int_:'20',
			octal_:'10',
			float_:'1.2',
			bool:'1',
			falseValue:'false',
			date:'2014-01-01',
			trim:' jim ',
			ltrim:' jim ',
			rtrim:' jim ',
			json:'{"a":1}',
			up:'jim',
			low:'Jim',
			escape:'<div>',
			stripLow:'abc\r',
			whitelist:'hello',
			blacklist:'hello',
			encodeURI:encodeURI(url),
			decodeURI:url,
			encodeURIComponent:encodeURIComponent(url),
			decodeURIComponent:url,
			rep:'a,b',
			debase64:"hello",
			base64:'aGVsbG8=',	//hello
			hash:"hello",		//md5 should be 5d41402abc4b2a76b9719d911017c592 , shal should be aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d


		}).expect(200)
		.expect('ok' , done);
	});
});


