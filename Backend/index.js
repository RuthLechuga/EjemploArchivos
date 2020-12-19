//En dado caso les da error por la libreria de oracledb
//Revisar los siguientes links: 
//https://oracle.github.io/node-oracledb/INSTALL.html
//https://oracle.github.io/node-oracledb/INSTALL.html#quickstart

const estudiantesRouter = require('./routes/estudiantes.route')

var express = require('express');
const bodyParser = require('body-parser');

var app = express();
const cors = require('cors')
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

app.use("/estudiantes", estudiantesRouter)

app.listen(port, function () {
  console.log('Listening on port',port);
});