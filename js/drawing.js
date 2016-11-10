var myDrawing = {
  D: {
    LS:{
      KEY_PRESENT_LAND_INFO_LIST: "KEY_PRESENT_LAND_INFO",
      KEY_MAX_LANDINFO_ID: "KEY_LANDINFO_ID",
    },
    M:{
      LI_S:{
        id: "id",
        abstractPlots: "p",
        name: "a",
        type: "b",
        status: "c",
        svgType: "d",
        startDate: "ds",
        endDate: "de",
        startSeedDate: "dss",
        endHarvestDate: "des",
        startHarvestDate: "dsh",
        endHarvestDate: "deh",
        remark: "z",
        lastModified: "lm",
      },
    },
  },
  common: {
    convertSVGPlot: function(plots, magnification){
      var result = "";
      for(var index in plots){
        result = result + Math.round(plots[index][0] / magnification) + "," + Math.round(plots[index][1] / magnification) + " ";
      }
      return result.substring(0, result.length - 1);
      //return [Math.round(plot[0] / magnification), Math.round(plot[1] / magnification)];
    },
    getBackground: function(type){
      try{
        var fill = $('#patternImg_' + type).attr('src');
        if(fill != null){
          return fill;
        }
      }catch(e){
        return "#aaaaaa";
      }
    },
    setInputField: function(formObject, json){
      for(var key in json){
        var inputField = $('[name=' + key + ']', formObject[0]);
        if(inputField != null){
          if(inputField.attr('type') == "text"){
            inputField.val(json[key])
          }

        }
      }
    }
  },
  rect : {
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
    makeNewPolygon: function(draw, plots, background, strokes, gSetup){
      var id = gSetup.landInfoId;
      gSetup.landInfoId = id + 1;
      return myDrawing.rect.makePolygon(draw, id, plots, background, strokes, gSetup);
    },
    makePolygon: function(draw, id, plots, background, strokes, gSetup){
      var polygon = draw.polygon(plots).fill(background).stroke(strokes);
      polygon.id = id;
      polygon.draggable().on('dragmove', function(e){
        if(!gSetup.isEditGraphObject){
          e.preventDefault();
          return false;
        }
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
      });
      return polygon;
    },
  },
  ls:{
    lRead: function(key){
      localStrage.getItem(key);
    },
    lSave: function(key, value){
      localStorage.setItem(key, value);
    },
  },
  ajax:{
    post: function(url, postData, successFunc, errorFunc){
      $.ajax({
        method: "POST",
        url: url,
        data: postData,
        cache: false,
        dataType: "json",
        processData: true,
      }).done(successFunc).fail(function(a,x,d){
        if($.isFunction(errorFunc)){
          errorFunc;
        }
      });
    }
  }
};


$(function(){
  var gSetup = {};
  gSetup.isEditGraphObject = false;
  gSetup.magnification = 1;
  gSetup.landInfoId = -1;
  //var data = {};
  var landInfoList = {};
  var landDetailList = {};
  var mySlidebar = new slidebars();
  var draw = SVG('drawing').size(300, 300);

  /* ロカールストレージから、私用中の土地情報一覧取得 */
  var lReadPresentLandInfoList = function(){
    var jsonText = localStorage.getItem(myDrawing.D.LS.KEY_PRESENT_LAND_INFO_LIST);
    if(jsonText != null){
      landInfoList = JSON.parse(jsonText);
      drawLandInfo(landInfoList);
    }
  };

  var getLandInfoFromServer = function(){
    var result = myDrawing.ajax.post("/sampleJson/landInfoSummaryList.json", null, function(data){
      if(landInfoList.lastModified == null || landInfoList.lastModified < data.lastModified){
        landInfoList = data;
        localStorage.setItem(myDrawing.D.LS.KEY_PRESENT_LAND_INFO_LIST, JSON.stringify(landInfoList));
        drawLandInfo(landInfoList);
      }
    });
  };

  var drawLandInfo = function(json){
    try{
      //var json = JSON.parse(jsonText);
      var list = json.root;
      var dkey = myDrawing.D.M.LI_S;
      var clickEvent = function(id){
        // Toggle the Slidebar with id 'landInfo'
        mySlidebar.toggle('landInfo');
        myDrawing.common.setInputField($("#f_landInfo"), list[id]);
        //$('').val(landInfo[dkey.name]);
      };
      for(var landInfoId in list){
        var landInfo = list[landInfoId];
        var svgType = landInfo[dkey.svgType];
        if(svgType === "4"){
          var polygon = myDrawing.rect.makePolygon(draw, landInfoId, myDrawing.common.convertSVGPlot(landInfo[dkey.abstractPlots], gSetup.magnification),
           myDrawing.common.getBackground(landInfo[dkey.type]), { width: 1 }, gSetup);
          polygon.on("click", function(event){
            if(!gSetup.isEditGraphObject){
              // Stop default action and bubbling
              event.stopPropagation();
              event.preventDefault();

              clickEvent(polygon.id);
            }
          });
          polygon.on("dblclick", function(event){
            if(gSetup.isEditGraphObject){
              // Stop default action and bubbling
              event.stopPropagation();
              event.preventDefault();

              clickEvent(polygon.id);
            }
          });
        }
      }
    }catch(e){
      console.log('[setLandInfoList error] ' + e.message);
    }
  }

  //var rect = draw.rect(100, 100).attr({ fill: '#f06' });
  //rect.draggable();

  $('#dynamicButton').on("click", function(){
    if(gSetup.isEditGraphObject){
      gSetup.isEditGraphObject = false;
    }else{
      gSetup.isEditGraphObject = true;
    }
  });

  $('#makeObjectButton').on("click", function(){
    var fill = $('#patternImg_bg1').attr('src');
    var polygon = myDrawing.rect.makeNewPolygon(draw, '0,0 110,10 100,50 50,100', fill, { width: 1 }, gSetup, mySlidebar);
  });

  $('#landInfoClose').on("click", function(){
    mySlidebar.close('landInfo');
  });
  //init action
  mySlidebar.init();
  gSetup.landInfoId = 1;
  if (!window.localStorage) {
    alert("ブラウザのローカルストレージを有効にしてください。");
  }
  lReadPresentLandInfoList();
  getLandInfoFromServer();
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