function initDraggableResizable(object, objectDraggable){
}

function setDraggableResizable(canvas, objectDraggable){
  jQuery.each(canvas.getLayerGroup('d_object_draggable'), function(){
    this.draggable = objectDraggable;});
}

function makeInitObject(canvas, id, objectDraggable, pattern, patternId){
  makeObject(canvas, id, 150, 150, objectDraggable, pattern, patternId);
}

function makeInitObject2(canvas, id, objectDraggable){
  makeObject2(canvas, id, 150, 150, objectDraggable);
}

function isRectLeftLine(layer, bordPx){
  if(layer.x - bordPx <= layer.eventX && layer.x + bordPx >= layer.eventX){
    return true;
  }
  else{
    return false;
  }
}

function isRectRightLine(layer, bordPx){
  if(layer.x + layer.originalWidth - bordPx <= layer.eventX && layer.x + layer.originalWidth + bordPx >= layer.eventX){
    return true;
  }
  else{
    return false;
  }
}

function isRectTopLine(layer, bordPx){
  if(layer.y - bordPx <= layer.eventY && layer.y + bordPx >= layer.eventY){
    return true;
  }
  else{
    return false;
  }
}

function isRectBottomLine(layer, bordPx){
  if(layer.y + layer.originalHeight - bordPx <= layer.eventY && layer.y + layer.originalHeight + bordPx >= layer.eventY){
    return true;
  }
  else{
    return false;
  }
}



function rectMax(centerX, length){
  return center + (length / 2); 
}

function makeObject(canvas, id, x, y, objectDraggable, pattern, patternId){
  if(pattern[patternId] == undefined){
    pattern[patternId] = canvas.createPattern({source: $("#patternImg_" + patternId)[0], repeat: 'repeat'});
    pattern['bg2'] = canvas.createPattern({source: $("#patternImg_bg2")[0], repeat: 'repeat'});
  }
  var result = canvas.drawRect({
    fromCenter: false,
    layer: true,
    name: id,
    groups:['d_object_draggable'],
    fillStyle: pattern[patternId],
    draggable: true,
    x: x, y: y,
    width:100, height:100,
    originalX: x, originalY: y,
    originalWidth: 100, originalHeight: 100,
    drag: function(layer) {

      if(isRectLeftLine(layer, 3)){
//layer.fillStyle= 'yellow'
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
//layer.fillStyle= 'black';
      }
      if(isRectTopLine(layer, 3)){
//layer.fillStyle= 'yellow'
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
      //layer.height = layer.y;
      //layer.x = x;
      //layer.y = y;
    },
    dragstop: function(layer) {
      layer.fillStyle= pattern[patternId];
      layer.originalX = layer.x;
      layer.originalY = layer.y;
      layer.originalWidth = layer.width;
      layer.originalHeight = layer.height;
    },
    dblclick: function(layer) {
      
    }

  });
  result.draggable = objectDraggable;
  //var sss = canvas.getLayer(id);
  //sss.width = 300;
  //sss.fillStyle = 'red';
  //initDraggableResizable(canvas, objectDraggable);
}

function makeObject2(canvas, id, x, y, objectDraggable){
}

function objectClick(e){
  //e.text(e.css('top') + e.css('left'));
}

function objectDClick(e){
  $("#lnavi").show();
  resizeUifield(false);
}

function resizeUifield(navihidden){
  var uisize = $("#my_body").width();
  if(navihidden){
    $("#uifieldbase").width(uisize);
  }else{
    $("#uifieldbase").width(uisize - $("#lnavi").width());
  }
}

$(document).ready(function(){

  var canvas = $("#uifield canvas");
  var objectBgPattern = new Object();
var img = new Image();
img.src = "../img/bg1.jpg";
var img2 = new Image();
img2.src = "../img/bg2.jpg";
  //objectBgPattern['bg1'] = canvas.createPattern({source: '../img/bg1.jpg', repeat: 'repeat'});
  //objectBgPattern['bg2'] = canvas.createPattern({source: '../img/bg2.jpg', repeat: 'repeat'});
  var presentInput;
  var number = 1;
  var objectDraggable = true;
  $("#makeObjectButton").click(function(){
    var id="d_boxObject" + number;
    makeInitObject(canvas, id, objectDraggable, objectBgPattern, 'bg1');
    number++;
  });

  $("#makeObjectButton2").click(function(){
    //var id="d_box2Object" + number;
    //makeInitObject2(canvas, id, objectDraggable);
      //number++;
    
  });

  $("#fixedButton").click(function(){
      objectDraggable = false;
      setDraggableResizable(canvas, objectDraggable);
  });

  $("#dynamicButton").click(function(){
      objectDraggable = true;
      setDraggableResizable(canvas, objectDraggable);
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
});

$(function(){
  var lnaviWidth = $("#lnavi").width();
  var uifieldWidth = $("#uifield").width();

  $('body').click(function(){
    var objects = $(".draggable");
    objects.each(function(i, ele){
      var object = $(ele);
      var left = object.position().left;
      var oLeft = object.width();
      if(left + oLeft > lnaviWidth + uifieldWidth){
        object.offset({left: (lnaviWidth + uifieldWidth - oLeft)});
      }
    });
  });

  jQuery('#jquery-ui-dialog-input1').dialog({
    autoOpen: false,
    width: 350,
    show: 'explode',
    hide: 'explode',
    modal: true,
    buttons: {
      'OK': function() {
        //setHidden(jQuery(this));
        jQuery(this).dialog('close');
      },
      'Cancel': function() {
        jQuery(this).dialog('close');
      }
    }
  });

});
