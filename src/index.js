const express = require('express');
const app = express();
const http = require('http').createServer(app);
const socketServer = require('./socketServer');

app.use(express.json());

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

socketServer.listen(http);

http.listen(3000, function(){
    console.log('listening on *:3000');
});
