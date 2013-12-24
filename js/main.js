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

            // Checks for winner.
            var winner = checkGraphForWinner(g);
            if (winner) {
                // what to do?
                console.log('Found winner.');
                for (var i = 0; i < winner.nodes.length; i++) {
                    console.log(winner.nodes[i]._name);
                }
            }
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

function checkForWin(nodes) {
    var player = -2;

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var setPlayer = node.getSetPlayer();
        if (player === -2) {
            player = setPlayer;
        }

        if (player === -1 || player !== setPlayer) {
            return false;
        }
    }

    return true;
}

function checkGraphForWinner(graph) {
    // check rows and columns
    var topL = [], topR = [];
    var checks = [topL, topR];
    for (var r = 0; r < graph.length; r++) {
        var row = graph[r];
        topL.push(row[0 + r]);
        topR.push(row[row.length - (1 + r)]);

        checks.push(row);
    }

    for (var c = 0; c < graph.length; c++) {
        var col = [];
        for (var r = 0; r < graph.length; r++) {
            col.push(graph[r][c]);
        }

        checks.push(col);
    }

    for (var i = 0; i < checks.length; i++) {
        if (checkForWin(checks[i])) {
            return {
                nodes: checks[i]
            };
        }
    }

    return false;
}
