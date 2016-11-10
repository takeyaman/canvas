var myDrawing = {
  common: {
    makeBackground: function(canvas, imgTag){
      return canvas.createPattern({source: imgTag, repeat: 'repeat'});
    },
  },
  rect : {
    isLeftLine: function(layer, bordPx){
      if(layer.x - bordPx <= layer.eventX && layer.x + bordPx >= layer.eventX){
        return true;
      }
      else{
        return false;
      }
    },
    isRightLine: function(layer, bordPx){
      if(layer.x + layer.originalWidth - bordPx <= layer.eventX && layer.x + layer.originalWidth + bordPx >= layer.eventX){
        return true;
      }
      else{
        return false;
      }
    },
    isTopLine: function(layer, bordPx){
      if(layer.y - bordPx <= layer.eventY && layer.y + bordPx >= layer.eventY){
        return true;
      }
      else{
        return false;
      }
    },
    isRectBottomLine: function(layer, bordPx){
      if(layer.y + layer.originalHeight - bordPx <= layer.eventY && layer.y + layer.originalHeight + bordPx >= layer.eventY){
        return true;
      }
      else{
        return false;
      }
    },
    rectMax: function(centerX, length){
      return center + (length / 2); 
    },
    isIncludeUp: function(position, linePoints1, linePoints2){
      if((linePoints2[0] - linePoints1[0]) * position[1] >= (linePoints2[1] - linePoints1[1]) * position[0] + ((linePoints2[0] - linePoints1[0]) * linePoints1[1] - (linePoints2[1] - linePoints1[1]) * linePoints1[0])){
        return true;
      }else{
        return false;
      }
    },
    isIncludeDown: function(position, linePoints1, linePoints2){
      if((linePoints2[0] - linePoints1[0]) * position[1] <= (linePoints2[1] - linePoints1[1]) * position[0] + ((linePoints2[0] - linePoints1[0]) * linePoints1[1] - (linePoints2[1] - linePoints1[1]) * linePoints1[0])){
        console.log("true");
        return true;
      }else{
        console.log("false");
        return false;
      }
    },
    make: function(canvas, name, x, y, width, height, backGround){
      return result = canvas.drawRect({
        fromCenter: false,
        layer: true,
        name: name,
        fillStyle: backGround,
        draggable: true,
        x: x,
        y: y,
        width:width,
        height:height,
        originalX: x,
        originalY: y,
        originalWidth: width,
        originalHeight: height,
        drag: function(layer) {

          if(isRectLeftLine(layer, 3)){
            if(layer.originalX + layer.originalWidth - layer.eventX >= 3){
              layer.width = layer.originalWidth - (layer.eventX - layer.originalX);
              layer.x = layer.eventX;
            }
          }else if(isRectRightLine(layer, 3)){
            //layer.fillStyle= 'blue';
            if(layer.eventX - layer.originalX >= 3){
              layer.width = layer.eventX - layer.originalX;
              layer.x = layer.originalX;
            }else{
              layer.x = layer.eventX - 3;
            }
          }else{
          }
          if(isRectTopLine(layer, 3)){
            if(layer.originalY + layer.originalHeight - layer.eventY >= 3){
              layer.height = layer.originalHeight - (layer.eventY - layer.originalY);
              layer.y = layer.eventY;
            }
          }else if(isRectBottomLine(layer, 3)){
            //layer.fillStyle= 'blue';
            if(layer.eventY - layer.originalY >= 3){
              layer.height = layer.eventY - layer.originalY;
              layer.y = layer.originalY;
            }else{
              layer.y = layer.eventY - 3;
            }
          }else{
            layer.fillStyle= pattern['bg2'];

          }
        },
        dragstop: function(layer) {
          layer.originalX = layer.x;
          layer.originalY = layer.y;
          layer.originalWidth = layer.width;
          layer.originalHeight = layer.height;
        },
      });
    },
  }
};


$(function(){
  var isEditGraphObject = false;
  var draw = SVG('drawing').size(300, 300);
  var rect = draw.rect(100, 100).attr({ fill: '#f06' });
  rect.draggable();
  var polygon = draw.polygon('0,0 110,10 100,50 50,100').fill('#00ffff').stroke({ width: 1 });
  polygon.draggable().on('dragmove', function(e){
    if(!isEditGraphObject){
      e.preventDefault();
      return false;
    }
    //if(e.currentTarget.attributes.points.)
    var points = this.array().value;
    var dragPosition = [e.detail.p.x, e.detail.p.y];
    if(dragPosition[0] - 5 <= points[0][0] && dragPosition[0] + 5 >= points[0][0] && dragPosition[1] - 5 <= points[0][1] && dragPosition[1] + 5 >= points[0][1]){
      e.preventDefault();
      if(myDrawing.rect.isIncludeUp(dragPosition, points[1], points[2]) && myDrawing.rect.isIncludeUp(dragPosition, points[2], points[3])){
        points[0] = dragPosition;
        this.plot(points);
      }
    }else if(dragPosition[0] - 5 <= points[1][0] && dragPosition[0] + 5 >= points[1][0] && dragPosition[1] - 5 <= points[1][1] && dragPosition[1] + 5 >= points[1][1]){
      e.preventDefault();
      if(myDrawing.rect.isIncludeUp(dragPosition, points[2], points[3]) && myDrawing.rect.isIncludeUp(dragPosition, points[3], points[0])){
        points[1] = dragPosition;
        this.plot(points);
      }
    }else if(dragPosition[0] - 5 <= points[2][0] && dragPosition[0] + 5 >= points[2][0] && dragPosition[1] - 5 <= points[2][1] && dragPosition[1] + 5 >= points[2][1]){
      e.preventDefault();
      if(myDrawing.rect.isIncludeUp(dragPosition, points[3], points[0]) && myDrawing.rect.isIncludeUp(dragPosition, points[0], points[1])){
        points[2] = dragPosition;
        this.plot(points);
      }
    }else if(dragPosition[0] - 5 <= points[3][0] && dragPosition[0] + 5 >= points[3][0] && dragPosition[1] - 5 <= points[3][1] && dragPosition[1] + 5 >= points[3][1]){
      e.preventDefault();
      if(myDrawing.rect.isIncludeUp(dragPosition, points[0], points[1]) && myDrawing.rect.isIncludeUp(dragPosition, points[1], points[2])){
        points[3] = dragPosition;
        this.plot(points);
      }
    }
    //alert(e.currentTarg]et.attributes.points.nodeValue + " " + e.target.attributes.points.nodeValue);
    var h = e;
  });
  polygon.on("click", function(event){
    //alert("クリック");
    if(!isEditGraphObject){
      // Stop default action and bubbling
      event.stopPropagation();
      event.preventDefault();

      // Toggle the Slidebar with id 'id-1'
      mySlidebar.toggle( 'id-1' );
    }
  });

        // Toggle Slidebars
        $( '.toggle-id-1' ).on( 'click', function ( event ) {
          // Stop default action and bubbling
          event.stopPropagation();
          event.preventDefault();

          // Toggle the Slidebar with id 'id-1'
          mySlidebar.toggle( 'id-1' );
        } );

        $( '.toggle-id-2' ).on( 'click', function ( event ) {
          // Stop default action and bubbling
          event.stopPropagation();
          event.preventDefault();

          // Toggle the Slidebar with id 'id-2'
          mySlidebar.toggle( 'id-2' );
        } );

        $( '.toggle-id-3' ).on( 'click', function ( event ) {
          // Stop default action and bubbling
          event.stopPropagation();
          event.preventDefault();

          // Toggle the Slidebar with id 'id-3'
          mySlidebar.toggle( 'id-3' );
        } );

        $( '.toggle-id-4' ).on( 'click', function ( event ) {
          // Stop default action and bubbling
          event.stopPropagation();
          event.preventDefault();

          // Toggle the Slidebar with id 'id-4'
          mySlidebar.toggle( 'id-4' );
        } );

  //init action
  var mySlidebar = new slidebars();
  mySlidebar.init();
  //var mySlidebar = new $.slidebars({
  //  siteClose: true,
  //  scrollLock: true
  //});



});
/*$(function(){

  var presentInput;
  var number = 1;
  var objectDraggable = true;
  $("#makeObjectButton").click(function(){
    var id="d_boxObject" + number;
    $("#uifield").append(makeInitObject(id, objectDraggable));
    number++;
  });

  $("#fixedButton").click(function(){
    objectDraggable = false;
    disableDraggableResizable(objectDraggable);
  });

  $("#dynamicButton").click(function(){
    objectDraggable = true;
    enableDraggableResizable(objectDraggable);
  });

  $("#lnaviClose").click(function(){
    $("#lnavi").hide();
    resizeUifield(true);
  });

  $("#input1").click(function(){
    presentInput = $("#h" + $(this).attr('id'));
    jQuery('#jquery-ui-dialog-input1').attr('title', $("#t" + $(this).attr('id')).text());
    jQuery('#jquery-ui-dialog-input1').dialog('open');
    setHidden($("#dummyInput1"));
  });

  function setHidden(e){
   presentInput.val(e.val());
   alert(e.val());
 }
});*/