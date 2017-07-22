var app = require('express')();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.listen(3000, function(){
    console.log('SERVER ON PORT 3000');
});

app.get('/ping', function(req, res){
    res.json({
        "pong": "OK"
    })
});

