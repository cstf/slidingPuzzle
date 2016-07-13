	'use strict';

	var module = angular.module('slidingPuzzle', []);


     module.directive('slidingPuzzle', function($interval,$filter) {
     	return {
     		restrict: 'EA',
     		replace: true,
     		template: '<div tabindex="0" ng-keydown="move($event)" ><div class="btn-start"><button type="button" class="btn btn-info" ng-click="startGame()">START</button></div><table  class="sliding-puzzle" ng-class="{\'puzzle-solved\': isSolved()}">' +
     		'<tr ng-repeat="($row, row) in grid">' +
     		'<td ng-animate=" '+'animate'+' " ng-repeat="($col, piece) in row" ng-style="piece.style" ng-class="{\'puzzle-empty\': piece.empty}" title="{{piece.id}}"></td>' +
     		'</tr>' +
     		'</table></div>',
     		scope: {
     			size: '@'
     		},
     		link: function(scope, element, attrs) {
     			var rows, cols,empty,id=1,emptyR,emptyC,interval,
     			moves = 0,image;
     			image = new Image();
     			image.src = 'images/viber.png';
                    image.onload = function() {
                        scope.$apply(function() {
                            createPieces();
                        });
                    };
     			scope.grid = [];
     			var size = scope.size.split('x');
     			rows = size[0];
     			cols = size[1];
     			init();

     			function init() {
     				scope.grid = [],id=1;
     				for (var row = 0; row < rows; row++) {
     					for (var col = 0; col < cols; col++) {
     						if (!scope.grid[row]) {
     							scope.grid[row] = [];
     						}
     						scope.grid[row][col] = {
     							id: id++,
     							empty: (row === rows - 1) && (col === cols - 1)
     						};
     						if (scope.grid[row][col].empty) {
     							empty = scope.grid[row][col];
     							emptyC = col;
     							emptyR = row;
     						}
     					}
     				}
     				createPieces();
     			}
     			function shuffle(a) {
     				var j, x, i;
     				for (i = a.length; i; i--) {
     					j = Math.floor(Math.random() * i);
     					x = a[i - 1];
     					a[i - 1] = a[j];
     					a[j] = x;
     				}
     			}
     			scope.isSolved = function() {
     				var id = 1;
     				for (var row = 0; row < rows; row++) {
     					for (var col = 0; col < cols; col++) {
     						if (scope.grid[row][col].id !== id++) {
     							return false;
     						}
     					}
     				}
     				if(scope.time){
     					$interval.cancel(interval);
     					var results = JSON.parse(localStorage.getItem('results')) || [];
     					results.push(scope.time);
     					results = $filter('orderBy')(results);
     					results.slice(0,10);
     					localStorage.setItem('results',JSON.stringify(results));

     					return true;
     				}
     			}
     			function mix() {
     				var pieces = [];
     				for(var i = 0 ;i < rows; i++)
     					pieces = pieces.concat(scope.grid[i])
     				
     				shuffle(pieces);

     				for(var i = 0;i < rows;i++)
     					for(var j = 0;j < cols;j++){
     						scope.grid[i][j] = pieces.shift();
     						if(scope.grid[i][j].empty){
     							emptyR = i;
     							emptyC = j;
     							empty = scope.grid[i][j];
     						}
     					}
     				}	
     			function createPieces() {
     					var width = image.width / cols,
     					height = image.height / rows;

     					for (var row = 0; row < rows; row++) {
     						for (var col = 0; col < cols; col++) {
     							scope.grid[row][col].style = {
     								width: width + 'px',
     								height: height + 'px',
     								background: (scope.grid[row][col].empty ? 'none' : "url('" + image.src + "') no-repeat -" + (col * width) + 'px -' + (row * height) + 'px')
     							};
     						}
     					}
     			}

     			scope.startGame = function(){
     				scope.time = 0;
     				interval = $interval(function(){
     					scope.time++;
     				},1000)
     				mix();
     			}
     			scope.move = function(event){
     				var temp;
     				function replace_items(row1,col1,row2,col2){
     					var temp = scope.grid[row1][col1];
     					scope.grid[row1][col1] = scope.grid[row2][col2];
     					scope.grid[row2][col2] = temp;
     				}
     				if(event.keyCode == 38 && scope.grid[emptyR+1] && scope.grid[emptyR+1][emptyC] ){
     					replace_items(emptyR+1,emptyC,emptyR,emptyC);
     					emptyR++;

     				}
     				if(event.keyCode == 40 && scope.grid[emptyR-1] && scope.grid[emptyR-1][emptyC] ){
     					replace_items(emptyR-1,emptyC,emptyR,emptyC);
     					emptyR--;
     				}
     				if(event.keyCode == 39 && scope.grid[emptyR][emptyC-1] && scope.grid[emptyR][emptyC-1] ){
     					replace_items(emptyR,emptyC-1,emptyR,emptyC);
     					emptyC--;
     				}
     				if(event.keyCode == 37 && scope.grid[emptyR][emptyC+1] && scope.grid[emptyR][emptyC+1] ){
     					replace_items(emptyR,emptyC+1,emptyR,emptyC);
     					emptyC++;
     				}
     			}

     			attrs.$observe('size', function(size) {
     				size = size.split('x');
     				if (size[0] >= 2 && size[1] >= 2) {
     					rows = size[0];
     					cols = size[1];
     					init();
     				}
     			});

     		}
     	};
     });
