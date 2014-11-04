var express = require('express'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	mongoose = require('mongoose'),
	config = require('./config.js'),
	mongoStore = require('connect-mongo')({session:session});
	
var app = express();

var db = mongoose.connect(config.db,function(err){
	if(err){
		return console.err("Fail to connect to database");
	}
});

app.use(cookieParser());

app.use(session({
secret : 'my secret',
cookie : {maxAge:3000},
store: new mongoStore({
	db : db.connection.db,
	collection : config.sessionCollection
})
}));

app.get('/',function(req,res){
	if(req.session.isVisit) {
		req.session.isVisit++;
		console.log(req.cookies);
		res.send('welcome back' + req.session.isVisit);
	}else {
		req.session.isVisit = 1;
		res.send('welcome new comer');
	}
});


app.listen(config.port,function(){
	console.log('Server listen on ' + config.port);
});
