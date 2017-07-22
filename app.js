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
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


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

    var records = 0;
    var limit = null;
    var pages = 0;
    var condicao = {};
    var query = {};

    if(req.query['title'] != null){
        var regex = new RegExp(req.query['title']);
        query['title'] = regex;
    }

    if((req.query['limit'] == null) || (req.query['limit'] <= 0)){
        limit = 50;
    }
    else{
        limit = parseInt(req.query['limit']);
    }
    
    Movie.count().where(query).exec(function(err, count){
        records = count;
        console.log("records: "+count);
    });

    Movie.find().limit(limit).where(query).exec(function(err, movies){
        if(err){
            console.log("err: " +err);
            return res.send(err); 
        }

        pages = records / limit;

        res.json({
            meta: {
                limit: limit,
                pages: pages,
                countRecords: movies.length,
                total: records
            },
            records: movies
        });
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