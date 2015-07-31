var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var five = require("johnny-five"),
    board, photoresistor;

http.listen(3000, function () {
    console.log('Express server listening on port 3000 ');
});

//It routes user acess to especified folder
app.use(express.static(__dirname + "/public"));

// Starting a connection from server

io.on('connection', function(socket){
  
  console.log("An user is connected");

  // Start a new connection with a board (Arduino)
  board = new five.Board();

  board.on("ready", function() {

    // Create a new `photoresistor` hardware instance.
    photoresistor = new five.Sensor({
      pin: "A2", // This is the physical pin on Arduino where sensor is connected
      freq: 250
    });

    // Inject the `sensor` hardware into
    // the Repl instance's context;
    // allows direct command line access
    board.repl.inject({
      pot: photoresistor
    });


    var values = 0;
    var readings = 0;
    var sensorLimit = 1040;
    // "data" get the current reading from the photoresistor
    photoresistor.on("data", function() {

      // Getting amount of light
      var sensorData = this.value;

      values = sensorLimit - sensorData;
      readings++;

      // This is the rate of readings from sensor.
      var threshold = 3;
      
      if(readings % threshold == 0){
        readings = 0;
        // if (this.value >= 300)
        readData(values);
      }
    });

    function readData(sensorValue){

      var d = new Date();
      var h = d.getHours();
      var m = d.getMinutes();
      var s = d.getSeconds();

      // It prits on terminal the sensor value and dateTime when collected
      console.log("sensor:" + sensorValue, d);

      // This broadcast data from server perspective
      io.emit('data sensor', sensorValue);
    }
  });
});