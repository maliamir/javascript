var client = require('./mongo_client'),
    request = require('request');
	
module.exports = {
    index: function(req, res) {
	    if (!req.session.userId) {
		    res.redirect('/login');
		} else {
		    var filter = {
			       'userId': req.session.userId,
                   'watched': false    				   
			    },
				options = {
				   sort: [['release_date',1]]
				};
			
			client
			   .db()
			   .collection('movies')
			   .find(filter, {}, options)
			   .toArray(function(err, movies) {
			        if (err) { throw err; }
					res.render('index', { 'pageTitle': 'My Movies !!!', 'movies': movies });
			   });
		}
	},
    showLogin: function(req, res) {
	    res.render('login');
	},
    processLogin: function(req, res) {
	    var userObj = {
		    email: req.body.email,
			password: req.body.password
		};  
	    
		client.db()
		   .collection('users')
		   .find(userObj, {}, {})
		   .toArray(function(err, users) {
		       if (users.length == 0) {
			      client
				    .db()
					.collection('users')
					.insert(userObj, function(err, users){
					    console.log('Insert Error: ' + err + '; users = ' + users);
					    req.session.userId = users[0]._id;
						res.redirect('/');
					});
			   } else{
			      req.session.userId = users[0]._id;
				  res.redirect('/');
		       }
		   });
	},
    addMovie: function(req, res) {
	    var apiUrl = [
		       'http://api.themoviedb.org/3/movie/',
			   req.body.movieid,
			   '?api_key=1a6f86ad423cc5544304a6fe19960bd3'
		    ].join('');
		console.log("API URL to add Movie = " + apiUrl);	
		request({
		      method: 'GET',
			  uri: apiUrl,
			  json: {}
		   },
		   function(error, data, movie) {
		      console.log("Adding Movie ID: " + req.body.movieid + " for User ID: " + req.session.userId);
		      if (!error) {
			     movie.userId = req.session.userId;
				 movie.watched = false;
				 client
				    .db()
					.collection('movies')
					.insert(movie, function(err) {
					    if(err) {
						   console.log(err);
						}
						res.redirect('/');
					});
			  } else {
			     console.log("Error = " + error);
			  }
		   }
		);	
	},
    watchedMovie: function(req, res) {
	     client
		    .db()
			.collection('movies')
			.update(
			   {
			      userId: req.session.userId,
				  id: req.params.id*1
			   }, {
			        $set: {
					   watched: true
					}
			   },
			   function(err, movie){
			       if (err) {
				      console.warn(err.message);
				   } else{
				      console.log("Movie ID: " + req.params.id + ' watched: ' + movie.watched + " for User ID: " + req.session.userId);
				   }
				   res.json(movie);
			   }			
			);
	}	
};