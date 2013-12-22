var Rx = require('rx');
var _ = require('lodash');

Rx.Observable.fromEvent('keydown', function(keyEvent) {
});


setTimeout(function() {
    console.log("End");
}, 100000);


