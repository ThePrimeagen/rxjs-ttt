var Rx = require('rx');
var _ = require('lodash');
var $ = require('jquery');
var Direction = require('./util/Direction');
var graph = require('./util/graph').graph;
var rxKeyboard = require('./util/rxKeyboard');

var TicTacToe = function($element) {
    var g = graph($element, {});
    var player = 0;
    var currentNode = g[0][0].setPlayer(player).enter();

    // Listens to the direction
    Direction.onKeyboardDirection.subscribe(function(direction) {
        currentNode = currentNode
            .exit()
            .getNeighbor(direction)
            .setPlayer(player)
            .enter();
    });

    var enter = rxKeyboard(13);

    enter
        .filter(function() {
            return !currentNode.isSet();
        })
        .subscribe(function(code) {
            currentNode.check();
            player = (++player) % 2;
        });

    enter
        .filter(function() {
            return currentNode.isSet();
        })
        .subscribe(function(code) {
            // what to do ?
            console.log('Oh no!');
        });
};

module.exports = TicTacToe;

