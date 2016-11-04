function initDraggableResizable(object, objectDraggable){
  object.resizable({ containment:'parent', scroll:false }).draggable({ containment:'parent', scroll:false });
  if(!objectDraggable){
    object.resizable('disable').draggable('disable');
  }
}

function disableDraggableResizable(objectDraggable){
  $(".draggable").resizable('disable').draggable('disable');
}

function enableDraggableResizable(object, objectDraggable){
  $(".draggable").resizable('enable').draggable('enable');
}

function makeInitObject(id, objectDraggable){
  return makeObject(id, 150, 150, objectDraggable);
}

function makeObject(id, x, y, objectDraggable){
var object = $("<div></div>", {
  id: id,
  width: x,
  height: y,
  css: {border: "0.1em solid gray", position: "absolute"},
  addClass: "draggable",
  on: {
    click: function(event) {
      objectClick($(this));
    },
    dblclick: function(event) {
      objectDClick($(this));
    },
    mouseover: function(event){
      $(this).css('background-color', 'Red');
    },
    mouseout: function(event){
      $(this).css('background-color', 'transparent');
    }
  }
});
initDraggableResizable(object, objectDraggable);
return object;
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

  //var boxObjectParamList = [];

  $("#uifield canvas").drawArc({
    fillStyle: 'black',
    draggable: true,
    x: 100, y: 100,
    radius: 50
  });
});
