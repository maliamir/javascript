(function(){
   var client = require('mongodb').MongoClient,
       mongodb;
	   
   module.exports = {
       connect: function(dburl, callback) {
	       client.connect(dburl,
		        function(err, db){
				
				    if(err) {
					   console.log('DB = ' + db + '; Error: ' + err);
                    } else {
					   mongodb = db;
					   console.log('Connected to MongoDB.');					   
					}				    
				    
					if(callback) { 
					   callback(); 
					}
					
				});
	   },
       db: function(){
	       return mongodb;
	   },
	   close: function(){
	       mongodb.close();
	   }
   };   
})();