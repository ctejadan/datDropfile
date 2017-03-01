var express = require('express');
var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');
var sesion = require('express-fileupload');
var easyimg = require('easyimage');
var childProcess = require('child_process');
var jsonFolders = require('./jsonFolders.json');


var sslOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  passphrase: 'llave2'
};


const port = 5000;
const app = express();



//Object.keys(jsonFolders).forEach(key=>{if(jsonFolders[key]!=='')carpetas.push(jsonFolders[key]);});

app.use(sesion());

app.post('/upload', (req, res)=> {
  let file= req.files.file;
  let fileName = file.name.replace(/\s+/g, '');
  res.send(fs.readdirSync('./5000/Files/'+jsonFolders[req.query.select]));
});

app.use(express.static(__dirname + '/build'))

app.set('port', process.env.PORT || 4000);

app.get('/', function(req, res) {
  res.sendFile(path.join( __dirname, 'index.html'));
});

app.get('/fotos', function(req, res) {
  let sep = req.query.foto.split('/');
  //console.log(sep);
  //console.log(sep[0]);//carpeta
  //console.log(sep[1]);//nombre
  setTimeout(() => {res.sendFile(path.join( __dirname, '5000/Files/'+ jsonFolders[sep[0]]+"/"+sep[1] ));}, 200);
});

app.get('/pictures', function(req, res) {
  let sep = req.query.picture.split('/');
  setTimeout(() => {res.sendFile(path.join( __dirname, '5000/Files/'+ jsonFolders[sep[0]]+"/"+sep[1] ));}, 200);
});


app.get('/imagenes', function(req, res) {
      res.send(fs.readdirSync('./5000/Files/'+jsonFolders[req.query.select]));
});

app.get('/new', function(req, res) {
  //revisar si llave existe
  if(!jsonFolders[req.query.new] && req.query.new!==""){
    let aux = [];
    let nuevo = 0;
      Object.keys(jsonFolders).forEach(key=>{aux.push(jsonFolders[key])});
      aux=Object.keys(aux).map(key => aux[key].split('C')[1]).sort(function(a,b){return a - b});

      for (i = 0; i < 49; i++) {
          if(aux[i] != i+1) {
           nuevo = i+1;
           break;
         }
      }
      jsonFolders[req.query.new] = 'C'+nuevo;
      fs.writeFile('jsonFolders.json', JSON.stringify(jsonFolders), 'utf8');
      res.send(Object.keys(jsonFolders));

  }
  else {
    console.log('Error');
  }
});

app.get('/removeFolder', function(req, res) {
  delete jsonFolders[req.query.select];
  fs.writeFile('jsonFolders.json', JSON.stringify(jsonFolders), 'utf8');
  res.send(Object.keys(jsonFolders));

});


app.get('/opciones', function(req, res) {
  res.send(Object.keys(jsonFolders));
});

app.get('/borrar', function(req, res) {
  childProcess.execSync("rm ./5000/Files/"+jsonFolders[req.query.select]+"/"+req.query.foto);
  res.send(fs.readdirSync('./5000/Files/'+jsonFolders[req.query.select]));
});

var server = https.createServer(sslOptions, app);
server.listen(port);

//http.createServer(app).listen(portHttp);

//https.createServer(sslOptions, app).listen(portHttps);
//app.listen(port, function(err) {
//  if (err) {
//    console.log(err);
//  }
//});
