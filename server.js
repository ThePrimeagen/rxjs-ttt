var express = require('express');
var path = require('path');
var app = express();

app
    .use(express.static(path.join(__dirname, '/static')))
    .use(express.static(path.join(__dirname, '/node_modules')))
    .listen('3000');