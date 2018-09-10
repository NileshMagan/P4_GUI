(function() {
  var $ = function(id){return document.getElementById(id)};

  var canvas = this.__canvas = new fabric.Canvas('c', {
    isDrawingMode: true
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

  clearEl.onclick = function() { canvas.clear() };

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


function debugBase64(base64URL){
  var win = window.open();
  win.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
}


function resizeImage(src) {
  // Create an image
  var img = document.createElement("img");
  img.src = src;

  var canvas = document.createElement("canvas");
  //var canvas = $("<canvas>", {"id":"testing"})[0];
  // var ctx = canvas.getContext("2d");
  // ctx.drawImage(img, 0, 0);

  var MAX_WIDTH = 200;
  var MAX_HEIGHT = 200;
  var width = img.width;
  var height = img.height;

  if (width > height) {
      if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
      }
  } else {
      if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
      }
  }
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);

  var dataurl = canvas.toDataURL("image/png");
  return dataurl;
}


function processImage() {
  var canvas = document.getElementById("c");
  var img = canvas.toDataURL("image/png");
  
  
  var button = document.getElementById('downloadImage');
  button.addEventListener('click', function (e) {                                              
    // var dataURL = canvas.toDataURL('image/png');
    resized_img = img;
      var resized_img = resizeImage(img);
    button.href = resized_img;
    console.log("IMG:");
    console.log(img);
    console.log("RESIZED IMG:");
    console.log(resized_img);
    debugBase64(resized_img);
  });

  // e.g This will open an image in a new window
  // debugBase64();


  button.click();
  // console.log(button.href);    
  // alert("hi");
}

function processImage() {
  var canvas = document.getElementById("c");
  var img = canvas.toDataURL("image/png");
  
  
  var button = document.getElementById('downloadImage');
  button.addEventListener('click', function (e) {                                              
    // var dataURL = canvas.toDataURL('image/png');
    // resized_img = img;
      var resized_img = resizeImage(img);
    button.href = resized_img;
    console.log("IMG:");
    console.log(img);
    console.log("RESIZED IMG:");
    console.log(resized_img);
    debugBase64(resized_img);
  });

  // e.g This will open an image in a new window
  // debugBase64();


  button.click();
  // console.log(button.href);    
  // alert("hi");
}


function getImage(_callback) {
    var canvas = document.getElementById("c");
    var img = canvas.toDataURL("image/png");
    // console.log("IMG-->: " + img);
    // const img = document.getElementById('id');

    fetch(img)
    .then(res => res.blob())
    .then(blob => {
      const file = new File([blob], 'dot.png', blob);
      // console.log(file);
      console.log("FINISHING THING");
      _callback(file);
    })


    // blobUtil.imgSrcToBlob(img.src).then(function (blob) {
    //   console.log('Read the content of the img as a blob of size ' + blob.size); 
    //   return new File([blob], 'new.png', blob);
    // })

    // var resized_img = resizeImage(img);
    // return resized_img;
    // return debugBase64(resized_img);
}




$(document).ready(function() {

  // process the form
  $('form').submit(function(event) {
      // Prevent default behaviour
      event.preventDefault();

      var imgFile = document.getElementById("uploadedImage").files[0];
      // var imgPath = getImage();



      // Get asynch procedure working
      getImage(function(file) {
        
          // Prepare form data with name and image
        var formData = new FormData();
        formData.append('_1',$('input[name=_1]').val());
        formData.append('_2',file);
  
        // Print form data
        // console.log("IMGP: ");
        // console.log(imgFile);
        console.log("GOTTEN FILE: ");
        for (var key of formData.entries()) {
          console.log(key[0] + ', ' + key[1]);
        }

        // Prcoess the form
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/api', // the url where we want to POST
            data        : formData, // our data object
            cache       : false, 
            dataType    : 'json', // Data to expect from server
            processData : false, // Don't process the files
            contentType : false, // Set content type to false as jQuery wil
            encode      : true
        })
        .done(function(data) {
        // using the done promise callback
          console.log(data); 
        });
      });
        


  });

});
