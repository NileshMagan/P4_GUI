// Fabric JS method to draw
(function() {
  var $ = function(id){return document.getElementById(id)};

  var canvas = this.__canvas = new fabric.Canvas('c', {
    isDrawingMode: true,
    backgroundColor: "black"
  });

  fabric.Object.prototype.transparentCorners = false;

  var drawingModeEl = $('drawing-mode'),
      drawingOptionsEl = $('drawing-mode-options'),
      drawingColorEl = $('drawing-color'),
      drawingShadowColorEl = $('drawing-shadow-color'),
      drawingLineWidthEl = $('drawing-line-width'),
      drawingShadowWidth = $('drawing-shadow-width'),
      drawingShadowOffset = $('drawing-shadow-offset'),
      clearEl = $('clear-canvas');

  clearEl.onclick = function() { 
    canvas.clear();
    canvas.backgroundColor = "black";
  };

  drawingModeEl.onclick = function() {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
      drawingModeEl.innerHTML = 'Cancel drawing mode';
      drawingOptionsEl.style.display = '';
    }
    else {
      drawingModeEl.innerHTML = 'Enter drawing mode';
      drawingOptionsEl.style.display = 'none';
    }
  };

  if (fabric.PatternBrush) {
    var vLinePatternBrush = new fabric.PatternBrush(canvas);
    vLinePatternBrush.getPatternSrc = function() {

      var patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.lineTo(10, 5);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var hLinePatternBrush = new fabric.PatternBrush(canvas);
    hLinePatternBrush.getPatternSrc = function() {

      var patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(5, 10);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var squarePatternBrush = new fabric.PatternBrush(canvas);
    squarePatternBrush.getPatternSrc = function() {

      var squareWidth = 10, squareDistance = 2;

      var patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
      var ctx = patternCanvas.getContext('2d');

      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, squareWidth, squareWidth);

      return patternCanvas;
    };

    var diamondPatternBrush = new fabric.PatternBrush(canvas);
    diamondPatternBrush.getPatternSrc = function() {

      var squareWidth = 10, squareDistance = 5;
      var patternCanvas = fabric.document.createElement('canvas');
      var rect = new fabric.Rect({
        width: squareWidth,
        height: squareWidth,
        angle: 45,
        fill: this.color
      });

      var canvasWidth = rect.getBoundingRect().width;

      patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
      rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

      var ctx = patternCanvas.getContext('2d');
      rect.render(ctx);

      return patternCanvas;
    };

    var img = new Image();
    img.src = '/res/images/honey_im_subtle.png';

    var texturePatternBrush = new fabric.PatternBrush(canvas);
    texturePatternBrush.source = img;
  }

  $('drawing-mode-selector').onchange = function() {

    if (this.value === 'hline') {
      canvas.freeDrawingBrush = vLinePatternBrush;
    }
    else if (this.value === 'vline') {
      canvas.freeDrawingBrush = hLinePatternBrush;
    }
    else if (this.value === 'square') {
      canvas.freeDrawingBrush = squarePatternBrush;
    }
    else if (this.value === 'diamond') {
      canvas.freeDrawingBrush = diamondPatternBrush;
    }
    else if (this.value === 'texture') {
      canvas.freeDrawingBrush = texturePatternBrush;
    }
    else {
      canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
    }

    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawingColorEl.value;
      canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
      canvas.freeDrawingBrush.shadow = new fabric.Shadow({
        blur: parseInt(drawingShadowWidth.value, 10) || 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: true,
        color: drawingShadowColorEl.value,
      });
    }
  };

  drawingColorEl.onchange = function() {
    canvas.freeDrawingBrush.color = this.value;
  };
  drawingShadowColorEl.onchange = function() {
    canvas.freeDrawingBrush.shadow.color = this.value;
  };
  drawingLineWidthEl.onchange = function() {
    canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
    this.previousSibling.innerHTML = this.value;
  };
  drawingShadowWidth.onchange = function() {
    canvas.freeDrawingBrush.shadow.blur = parseInt(this.value, 10) || 0;
    this.previousSibling.innerHTML = this.value;
  };
  drawingShadowOffset.onchange = function() {
    canvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 0;
    canvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 0;
    this.previousSibling.innerHTML = this.value;
  };

  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = drawingColorEl.value;
    canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
    canvas.freeDrawingBrush.shadow = new fabric.Shadow({
      blur: parseInt(drawingShadowWidth.value, 10) || 0,
      offsetX: 0,
      offsetY: 0,
      affectStroke: true,
      color: drawingShadowColorEl.value,
    });
  }

})();


$( document ).ready(function() {
    // Add spinner
    addSpinner();
});

// Create Spinner 
function addSpinner() {
  // import {Spinner} from 'spin.js';
  
  var opts = {
    lines: 13, // The number of lines to draw
    length: 38, // The length of each line
    width: 17, // The line thickness
    radius: 45, // The radius of the inner circle
    scale: 1, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    color: '#f0f0f0', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    speed: 1, // Rounds per second
    rotate: 0, // The rotation offset
    animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    className: 'spinner', // The CSS class to assign to the spinner
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '0 0 1px transparent', // Box-shadow for the lines
    position: 'absolute' // Element positioning
  };

  var target = document.getElementById('spinner');
  var spinner = new Spinner(opts).spin(target);
}

// Method to resize image
function resizeCanvas(canvas, src, _callback) {

  // Dimensions of reszed canvas
  var MAX_WIDTH = 20;
  var MAX_HEIGHT = 20;

  // Get image of canvas and wait till it loads
  var image = new Image();
  image.src = src;
  image.onload = function () {
      console.log("1st to execute");

      // Get new image dimensions  
      image.width = MAX_WIDTH;
      image.height = MAX_HEIGHT;

      // Resize canvas
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
    
      // Get url of image and return callback
      var dataurl = canvas.toDataURL("image/png");
      _callback(dataurl);
  }

}

// Clone canvas
function cloneCanvas(oldCanvas) {

  // Create a new canvas
  var newCanvas = document.createElement('canvas');
  var context = newCanvas.getContext('2d');

  // Set dimensions
  newCanvas.width = oldCanvas.width;
  newCanvas.height = oldCanvas.height;

  // Apply the old canvas to the new one
  context.drawImage(oldCanvas, 0, 0);

  // Return the new canvas
  return newCanvas;
}

var numberOfImages = 0;
var numberCorrect = 0;
// Statistics updater
function updateStatistics( check ) {
  numberOfImages++;
  if (check) {
    numberCorrect++;
  }
    accuracy = numberCorrect/numberOfImages * 100;
    accuracy = Number( accuracy.toPrecision(3) )
    document.getElementById("accuracy").innerHTML = accuracy; 
    document.getElementById("image-no").innerHTML = numberOfImages; 

    // Handle overlays
    overlay1.style.display = "none";
    // document.getElementById("inner-2").style.zIndex = "auto"; 
    document.getElementById("inner-3").style.zIndex = "auto"; 
}


// Triggered to send image to backend
function processImage() {
  
  // Change display
  var overlay = document.getElementById("overlay");
  overlay.style.display = "inline";

  // Grab image from canvas and make a copy
  var canvas = document.getElementById("c");
  var canvasCopy = cloneCanvas(canvas);

  // Pass copy so original not affected and provide callback
  canvasToImage(canvasCopy, function(file) {

    // Prepare form data with name and image
    var formData = new FormData();
    formData.append('_1',"Image_name");
    formData.append('_2',file);

    // Print form data
    console.log("Form data: ");
    for (var key of formData.entries()) {
      console.log(key[0] + ', ' + key[1]);
    }

    // Process the form
    $.ajax({
        type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
        url         : '/saveImage', // the url where we want to POST
        data        : formData, // our data object
        cache       : false, 
        dataType    : 'text', // Data to expect from server
        processData : false, // Don't process the files
        contentType : false, // Set content type to false as jQuery wil
        encode      : true,
		success: function(response, status, jqXHR){
      var data = JSON.parse(response);
			console.log(data.HW.res);
			console.log(data.SW.res);
			console.log(data.HW.clockCycles);
      console.log(data.SW.clockCycles);
      
      // Handle overlays
      overlay.style.display = "none";
      overlay1.style.display = "inline";
      // document.getElementById("inner-2").style.zIndex = 1; 
      document.getElementById("inner-3").style.zIndex = 1; 
      

      document.getElementById("HW-res").innerHTML = data.HW.res; 
      document.getElementById("SW-res").innerHTML = data.SW.res; 
      document.getElementById("HW-CC").innerHTML = data.HW.clockCycles; 
      document.getElementById("SW-CC").innerHTML = data.SW.clockCycles; 

		},
		error: function(response, status, jqXHR){
			console.log(status);
		}
    });
  });
}

// Method to convert a canvas canvas to file
function canvasToImage(canvas, _callback) {
  // Get canvas data and convert it to a URL
  var imgSrc = canvas.toDataURL("image/png");
  resizeCanvas(canvas, imgSrc, function(src) {    
    console.log("2nd to execute");
      // Get image from URL and create a file from it
      fetch(src)
      .then(res => res.blob())
      .then(blob => {
        // Create file and then trigger callback again
        const file = new File([blob], 'dot.png', blob);
        _callback(file);
      })
  });
}
