var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:8081/api");
var token='';

describe("Sample unit Test", function(){

	it("Base url Test", function(done){

		server.
		get("/")
		.expect(200)
		.end(function(err, res){
			res.status.should.equal(200);
			done();
		});
	});

	
});

describe("Test #1", function(){

	it("login", function(done){

		server.
		post("/login")
		.send({username: "neo", password: "neo" })
		.expect(200)
		.end(function(err, res){
			res.body.should.have.property("token");
			res.body.success.should.equal(true);
			res.status.should.equal(200);
			done();
		});
	});

	
});


describe("Test #2", function(){

	it("login", function(done){

		server.
		post("/login")
		.send({username: "neo"})
		.expect(200)
		.end(function(err, res){
			// res.body.should.have.property("token");
			res.body.success.should.equal(false);
			res.status.should.equal(200);
			done();
		});
	});

	
});

describe("JSON Patch Testing", function(){

	before(function(done){

		server.
		post("/login")
		.send({username: "neo", password: "neo" })
		.expect(200)
		.end(function(err, res){
			res.body.should.have.property("token");
			token=res.body.token;
			res.body.success.should.equal(true);
			res.status.should.equal(200);
			done();
		});
	});

	it("should not be able to add json patch", function(done){

		server.
		post('/applyJsonPatch')
		.send({jsonData: { "baz": "qux", "foo": "bar"},
		 jsonPatch: [ { "op": "replace", "path": "/baz", "value": "boo" }]})
		.expect(403)
		.end(function(err,res){
			res.body.success.should.equal(false);
			res.status.should.equal(403);
			done();
		});
	});

	it("should return invalid", function(done){

		server.
		post('/applyJsonPatch')
		.set('x-access-token', token)
		.send({jsonData: { "baz": "qux", "foo": "bar"}})
		.expect(200)
		.end(function(err,res){
			console.lo
			res.body.success.should.equal(false);
			done();
		});
	});

	it("should be able to add json patch", function(done){

		server.
		post('/applyJsonPatch')
		.set('x-access-token', token)
		.send({jsonData: { "baz": "qux", "foo": "bar"},
		 jsonPatch: [ { "op": "replace", "path": "/baz", "value": "boo" }]})
		.expect(200)
		.end(function(err,res){
			console.lo
			res.body.success.should.equal(true);
			done();
		});
	});

})

describe("ThumbNail Creation Test", function(){
	
	//As sometimes due to large imageSize downloading may take some time
	this.timeout(4000);

	before(function(done){

		server.
		post("/login")
		.send({username: "neo", password: "neo" })
		.expect(200)
		.end(function(err, res){
			res.body.should.have.property("token");
			token=res.body.token;
			res.body.success.should.equal(true);
			res.status.should.equal(200);
			done();
		});
	});

	it("should not be able to create Thumbnail", function(done){

		server.
		post('/createThumbnail')
		.send({imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/6a/59/38/6a5938935621d843c480fc0144570958.jpg",
				fileName: "ScarlettJ"})
		.expect(403)
		.end(function(err,res){
			res.body.success.should.equal(false);
			res.status.should.equal(403);
			done();
		});
	});

	it("should return invalid Params", function(done){
		this.timeout(4000);
		server.
		post('/createThumbnail')
		.set('x-access-token', token)
		.send({imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/6a/59/38/6a5938935621d843c480fc0144570958.jpg"})
		.expect(200)
		.end(function(err,res){
			console.lo
			res.body.success.should.equal(false);
			done();
		});
	});

	it("should be able to create Thumbnail", function(done){
		
		server.
		post('/createThumbnail')
		.set('x-access-token', token)
		.send({imageUrl: "https://s-media-cache-ak0.pinimg.com/originals/6a/59/38/6a5938935621d843c480fc0144570958.jpg",
				fileName: "ScarlettJ"})
		.expect(200)
		.end(function(err,res){
			console.lo
			res.body.success.should.equal(true);
			done();
		});
	});

})