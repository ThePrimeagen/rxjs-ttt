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
    var gameWinObservable = winnerObservable(g);
    var controlsObservable = setupControls(gameWinObservable, currentNode);

    controlsObservable.subscribe(function(val) {
    });

    gameWinObservable
        .subscribe(function(winData) {
            var nodes = winData.nodes;
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].color('#700');
            }
        });
};

function setupControls(gameWinningObservable, firstNode) {
    var player = 0;

    return Rx.Observable.merge(Direction.onKeyboardDirection, rxKeyboard(13))
        .takeUntil(gameWinningObservable)
        .scan(firstNode, function(currentNode, val) {

            // enter key pressed
            if (val === 13) {
                currentNode.check();
                player = (++player) % 2;
                return currentNode;
            } else {
                // Direction key pressed
                return currentNode
                        .exit()
                        .getNeighbor(val)
                        .setPlayer(player)
                        .enter();
            }
        });
}

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

/**
 * Checks for a winner of the graph.
 * @param graph
 */
function winnerObservable(graph) {

    return Rx.Observable.create(function(observer) {
        var enter = rxKeyboard(13);
        enter.subscribe(function() {
            var res = isThereWinner();
            if (res) {
                observer.onNext(res);
                observer.onCompleted();
            }
        });

        function isThereWinner() {
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
    });
}
