var path = require('path');
    router = require('./router');
	express = require('express');
	exphbs = require('express-handlebars');
	cookieParser = require('cookie-parser');
	session = require('express-session');
	bodyParser = require('body-parser');
	methodOverride = require('method-override');
	morgan = require('morgan');
	
module.exports = function(app) {
    app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'handlebars');
	
	app.engine('handlebars', exphbs.create({
	     defaultLayout: 'main',
         layoutsDir: app.get('views') + '/layouts'   		 
	}).engine);
	
	app.use(morgan('dev'));
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(methodOverride());
	app.use(cookieParser('super-secret-key-here'));
	app.use(session({ 
		 secret: 'super-secret-key-here',
		 saveUninitialized: true,
		 resave: true
	}));
	
	var publicPath = path.join(__dirname, '/public');
	console.log('Public Path = ' + publicPath);
	app.use('/public', express['static'](publicPath));
	
	router.initialize(app, new express.Router());
	
	return app;
};