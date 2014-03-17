+function($){

	$.fn.drawingBoard = function(options){

		this.each(function(){
			if(this.drawingBoard)return;
			var defaultOptions = {
				canvasWidth : 600,
				canvasHeight: 400,
				canvasClass: "maincanvas",
				backgroudColor: "white"
			};
			var opt = $.extend({},defaultOptions, options);
			var drawing;
			var points=[];
			var lastPoint = {};
			var that  = $(this);
			var mousedowning = false;
			var canvasOffset = $(this).offset();
			var canvasCtx;
			var historys=[];
			var backGroundImage;
			// var historyPoints=[];
			var restores=[];
			this.drawingBoard = {
				init: function(){
					canvasCtx = this.canvasCtx = that[0].getContext("2d");	
					if(!that.width()) that.attr("width",opt.canvasWidth);
					if(!that.height()) that.attr("height",opt.canvasHeight);
					canvasCtx.fillStyle = opt.backgroudColor;
					canvasCtx.fillRect(0, 0, that.width(), that.height);	
					backGroundImage = canvasCtx.getImageData(0, 0, that.width(), that.height());	
					drawing = false;
					this.bindingEvents();
				},
				bindingEvents: function(){
					var self = this;
					$(that).mousedown(function(event){
						if(historys.length==5){
							historys.shift();
						}
						historys.push(canvasCtx.getImageData(0,0, that.width(), that.height()));

						canvasCtx.strokeStyle = $("#colorSelect").val()||"#df4b26";
						canvasCtx.lineJoin = "round";
						canvasCtx.lineWidth = $("#pensize").val()||5;
						var x = event.pageX - canvasOffset.left;
						var y = event.pageY - canvasOffset.top;
						drawing = true;
						mousedowning = true;
						addPoints(x, y);
						self.redraw();
					});
					$(that).mousemove(function(event){
						if(drawing){
							var x = event.pageX - canvasOffset.left;
							var y = event.pageY - canvasOffset.top;
							addPoints(x, y, true);
							self.redraw();
						}
					});
					$(that).mouseup(function(event){
						drawing = false;
						mousedowning = false;
						lastPoint = {};
						
						// canvasCtx.save();
					});
					$(that).mouseleave(function(event){
						drawing = false;

					});
					$(that).mouseenter(function(event){
						if(mousedowning){
							var x = event.pageX - canvasOffset.left;
							var y = event.pageY - canvasOffset.top;
							lastPoint.dx = x;
							lastPoint.dy = y;
							drawing = true;
						}
					});
					$("#revocationBtn").click(function(){
					
						if(!historys || !historys.length)return;
						restores.push(canvasCtx.getImageData(0,0, that.width(), that.height()));
						var imageData = historys.pop();
						canvasCtx.putImageData(imageData, 0, 0);
					});
					$("#restoreBtn").click(function(){
						if(!restores || !restores.length)return;
						historys.push(canvasCtx.getImageData(0,0, that.width(), that.height()));
						var imageData = restores.pop();
						canvasCtx.putImageData(imageData, 0, 0);
					});

					$("#clearBtn").click(function(){
						canvasCtx.putImageData(backGroundImage, 0, 0);
						restores = [];
						historys = [];
					});
				},
				redraw : function(param){
					var vPoints = param|| points;
					
					for(var i=0, length = vPoints.length; i< length; i++){
						var point = vPoints.pop();
			  			canvasCtx.beginPath();
						if(point.draging && lastPoint.dx && lastPoint.dy){
							
							canvasCtx.moveTo(lastPoint.dx, lastPoint.dy);
						}else{
							
							canvasCtx.moveTo(point.x -1, point.y);
						}
						lastPoint.dx = point.x;
						lastPoint.dy = point.y;
						canvasCtx.lineTo(point.x, point.y);
						canvasCtx.closePath();
			  			canvasCtx.stroke();
			  			
					}
				}
			};
			function addPoints(x, y, draging){
				// var point = {x: x, y:y, draging: draging};
				points.push({x: x, y:y, draging: draging});
				// historyPoints.unshift({x: x, y:y, draging: draging});
			}
			this.drawingBoard.init();	
		});
	}
}(jQuery)