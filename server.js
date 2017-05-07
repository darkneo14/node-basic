var Jwt = require('jsonwebtoken');
var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var util = require('util');
var morgan = require('morgan');
var jsonpatch = require('jsonpatch');
var request = require('request');
var fs = require('fs');
var sharp = require('sharp');
var http = require('http');
var apiRoutes = express.Router();

var resizeTransform = sharp().resize(50, 50);

app.set('SecretKey', 'halula');

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({  extended: true  }));

// For Logging
app.use(morgan('dev'));

app.use(express.static('img'));

//Api Routes

apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});


apiRoutes.post('/login', function (req, res) {


	var userName = req.body.username;
	var password = req.body.password;

	if(!userName || !password){
		return res.json({ success: false, message: 'Invalid Parameters' });
	}
	else{
		var tokenData = {
	                 username: userName,
	                 name: "Test User",
	                 id: "Neo"
		};
	 
		var result = { 
			success: true,
			token: Jwt.sign(tokenData, app.get('SecretKey'), { expiresIn: 1440 })
		};

		res.json(result);
	}

	// res.send();
})

apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {

    // verifies secret and checks exp
    Jwt.verify(token, app.get('SecretKey'), function(err, decoded) {      
      if (err) {
        		return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

//Api for Applying Json Patch to JsonData
apiRoutes.post('/applyJsonPatch', function (req, res) {

	// console.log(util.inspect(req.body,false,null));
	var jsonData = req.body.jsonData;
	var jsonPatch = req.body.jsonPatch;

	if(!jsonData || !jsonPatch){
		return res.json({ success: false, message: 'Invalid Parameters' });
	}
	else{
	// console.log(jsonPatch);
		var finalData = jsonpatch.apply_patch(jsonData, jsonPatch);

		res.json({success: true, finalData: finalData});
	}
})


//Api for Creating Thumbnail
apiRoutes.post('/createThumbnail', function (req, res) {
	
	var uri = req.body.imageUrl;
	var fileName = req.body.fileName;
	if(!uri || !fileName){
		return res.json({ success: false, message: 'Invalid Parameters' });
	}
	else{
		download(uri, fileName, function(ext){
  			var link = "img/" + fileName + "." + ext;
  			console.log(link);
  			sharp(link).resize(50,50).toFile("img/"+ fileName +"1." + ext).then(function(){fs.unlink(link);});
  		
  			res.json({success: true, ThumbnailUrl: "localhost:8081/"+fileName +"1." + ext});
		});
	}
    
	
})


app.use('/api', apiRoutes);

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})


//************* Downloading **************



var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    var ext = res.headers['content-type'].split('/')[1];
    // console.log(ext);
    var link = "img/" + filename + "." + ext;

    request(uri).pipe(fs.createWriteStream(link)).on('close', function(){ callback(ext); });
  });
};