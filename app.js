var app = require('express')();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Movie = require('./models/movie');
var port = process.env.PORT || '3000';

var dbName = process.env.DB_NAME || 'movieDB';
var dbHost = process.env.DB_HOST || 'localhost';
var dbPort = process.env.DB_PORT || '27017';

var dbConnect = 'mongodb://' + dbHost + ':' + dbPort + '/' + dbName;
var promisse = mongoose.connect(dbConnect, {
    useMongoClient: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, function(){
    console.log( 'SERVER ON PORT ' + port );
});

app.get('/movies/ping', function(req, res){
    res.json({
        "pong": "OK"
    })
});

app.post('/movies', function(req, res){
    var movie = new Movie(req.body);
    movie.save(function(err){
        if(err){
            console.log("err: " +err);
            return res.send(err);
        }
        res.send({
            message: "Movie Added"
        });

    });
});

app.get('/movies', function(req, res){
    Movie.find(function(err, movies){
        if(err){
            console.log("err: " +err);
            return res.send(err); 
        }

        res.json(movies);
    });
});

app.put('/movies/:id',function(req,res){
    Movie.findOne({_id: req.params.id}, function(err, movie){
        if(err){
            return res.send(err);
        }

        for (atributo in req.body){
            console.log(atributo);
            movie[atributo] = req.body[atributo];
        }

        movie.save(function(err){
            if (err){
                return res.send(err);
            }

            res.json({message: 'Movie updated!'});
        });
    });
});

app.delete('/movies/:id', function(req, res){
    Movie.remove({_id: req.params.id}, function(err, movie){
        if(err){
            return res.send(err);
        }

        res.json({message: "Successfully deleted"});
    });
});

app.get('/movies/:id', function(req, res){
    Movie.findOne({_id: req.params.id}, function(err, movie){
        if(err){
            return res.send(err);
        }

        res.json(movie);
    });
});