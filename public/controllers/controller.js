
var myApp = angular.module('myApp', []);

myApp.controller("AppCtrl", ['$scope', '$http', function($scope, $http) { 
	
	var socket = io();
	constructPhotometer();
	
	// This function builds a Photometer retrieving data from sensor
	function constructPhotometer(data) {
		
		$('#container').highcharts({

		  chart: {
		      type: 'gauge',
		      plotBackgroundColor: null,
		      plotBackgroundImage: null,
		      plotBorderWidth: 0,
		      plotShadow: false
		  },

		  title: {
		      text: 'Light Sensor'
		  },

		  pane: {
		      startAngle: -150,
		      endAngle: 150,
		      background: [{
		          backgroundColor: {
		              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
		              stops: [
		                  [0, '#FFF'],
		                  [1, '#333']
		              ]
		          },
		          borderWidth: 0,
		          outerRadius: '109%'
		      }, {
		          backgroundColor: {
		              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
		              stops: [
		                  [0, '#333'],
		                  [1, '#FFF']
		              ]
		          },
		          borderWidth: 1,
		          outerRadius: '107%'
		      }, {
		          // default background
		      }, {
		          backgroundColor: '#DDD',
		          borderWidth: 0,
		          outerRadius: '105%',
		          innerRadius: '103%'
		      }]
		  },

		  // the value axis
		  yAxis: {
		      min: 10,
		      max: 1000,

		      minorTickInterval: 'auto',
		      minorTickWidth: 1,
		      minorTickLength: 10,
		      minorTickPosition: 'inside',
		      minorTickColor: '#666',

		      tickPixelInterval: 30,
		      tickWidth: 2,
		      tickPosition: 'inside',
		      tickLength: 10,
		      tickColor: '#666',
		      labels: {
		          step: 2,
		          rotation: 'auto'
		      },
		      title: {
		          text: 'Lux/s'
		      },
		      plotBands: [{
		          from: 0,
		          to: 100,
		          color: '#55BF3B' // green
		      }, {
		          from: 100,
		          to: 150,
		          color: '#DDDF0D' // yellow
		      }, {
		          from: 150,
		          to: 1000,
		          color: '#DF5353' // red
		      }]
		  },

		  series: [{
		      name: 'Lumens',
		      data: [100],
		      tooltip: {
		          valueSuffix: ' Lux/s'
		      }
		  }]

		},
		// Modificator function
		function (chart) {
	      if (!chart.renderer.forExport) {
		
			socket.on('data sensor', function(msg){ 
			    
			    if(msg >= 250){
			    	// alert("Carga violada!");
			    }

			    var point = chart.series[0].points[0],
	                  newVal,
	                  inc = msg;

	              newVal = msg;
	              if (newVal < 0 || newVal > 1000) {
	                  newVal = point.y - msg;
	              }

	              point.update(newVal);
			  });
	      }
		});
	}
}]);﻿