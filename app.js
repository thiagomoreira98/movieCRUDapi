var app = require('express')();
var bodyParser = require('body-parser');
var Movie = require('./models/movie');
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, function(){
    console.log( 'SERVER ON PORT ' + port );
});

app.get('/ping', function(req, res){
    res.json({
        "pong": "OK"
    })
});

app.post('/movies', function(req, res){
    //var movie = new Movie(req.body);
    res.json(req.body);
});

