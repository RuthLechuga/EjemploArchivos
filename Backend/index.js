var express = require('express');
const bodyParser = require('body-parser');

var app = express();
const cors = require('cors')
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())


app.listen(port, function () {
  console.log('Listening on port',port);
});

app.get('/', function (req, res) {
    res.send('Hola mundo!');
});

app.get('/Nombre', function (req, res) {
  res.send('Ruth Lechuga :)');
});

app.post('/Prueba', function(req, res){
    console.log(req.body)

    const body = req.body
    const carnet = body.carnet
    const nombre = body.nombre

    res.send(`El carnet de ${nombre} es ${carnet}`)
});