var myDrawing = {
  D: {
    LAST_MODIFIED_KEY: "lm",
    SERVER_LAST_MODIFIED_KEY: "slm",
    LS:{
      KEY_PRESENT_LAND_INFO_LIST: "KEY_PRESENT_LAND_INFO",
      KEY_SETUP: "KEY_SETUP",
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
        serverLastModified: "slm"
      },
    },
  },
  date:{
    getDatetime: function(){
      var time = new Date();
      return time.getFullYear() + "/" + ("0" + (time.getMonth() + 1)).slice(-2) + "/" + ("0" + time.getDate()).slice(-2) + " "
      + ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2) + ":" + ("0" + time.getSeconds()).slice(-2) + "."
      + ("00" + time.getMilliseconds()).slice(-3);
    },
  },
  common: {
    hasElements: function(jQueryObject){
      if(jQueryObject[0] != null){
        return true;
      }else{
        return false;
      }
    },
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
        var inputField = $('[name=' + key + ']', formObject);
        if(myDrawing.common.hasElements(inputField)){
          var tagName = inputField.prop("tagName");
          if(tagName == "INPUT"){
            var inputType = inputField.attr('type');
            if(inputType == "radio"){
              if(json[key] == inputField.val()){
                inputField.prop("checked", true);
              }
            }else if(inputType == "checkbox"){
              if($.isArray(json[key])){
                var isCheck = false;
                for(var index in json[key]){
                  if(inputField.val() == json[key][index]){
                    inputField.prop('checked', true);
                    break;
                  }
                }
                if(!isCheck){
                  inputField.prop('checked', false);
                }
              }else{
                if(inputField.val() == initValues[name]){
                  inputField.prop('checked', true);
                }else{
                  inputField.prop('checked', false);
                }
              }
              if(json[key] == inputField.val()){
                inputField.prop("checked", true);
              }
            }else{
              inputField.val(json[key]);
            }
          }else if(tagName == "SELECT"){
            inputField.val(json[key]);
          }else if(tagName == "TEXTAREA"){
            inputField.val(json[key]);
          }
        }
      }
    },
    resetAllInputField: function(formObject, initValues){
      var inputFields = $("[name]", formObject);
      for(var i = 0; i < inputFields.length; i++){
        var inputField = $(inputFields[i]);
        var tagName = inputField.prop("tagName");
        var name = inputField.attr("name");
        if(name == null || name == ""){
          continue;
        }
        if(tagName == "INPUT"){
          var inputType = inputField.attr('type');
          if(inputType == "radio"){
            if(initValues != null && initValues[name] != null){
              if(inputField.val() == initValues[name]){
                inputField.prop('checked', true);
              }else{
                inputField.prop('checked', false);
              }
            }else{
              inputField.prop('checked', false);
            }
          }else if(inputType == "checkbox"){
            if(initValues != null && initValues[name] != null){
              if($.isArray(initValues[name])){
                var isInitCheck = false;
                for(var index in initValues[name]){
                  if(inputField.val() == initValues[name][index]){
                    inputField.prop('checked', true);
                    isInitCheck = true;
                    break;
                  }
                }
                if(!isInitCheck){
                  inputField.prop('checked', false);
                }
              }else{
                if(inputField.val() == initValues[name]){
                  inputField.prop('checked', true);
                }else{
                  inputField.prop('checked', false);
                }
              }
            }else{
              inputField.prop('checked', false);
            }
          }else{
            if(initValues != null && initValues[name] != null){
              inputField.val(initValues[name]);
            }else{
              inputField.val("");
            }
          }
        }else{ //SELECT TEXTAREA
          if(initValues != null && initValues[name] != null){
            inputField.val(initValues[name]);
          }else{
            inputField.val("");
          }
        }
      }
    },
    updateJSON: function(json, formObject){
      var checkedRadioCheckboxSelectName = {};
      for(var key in json){
        var inputField = $('[name=' + key + ']', formObject);
        if(myDrawing.common.hasElements(inputField)){
          var tagName = inputField.prop("tagName");
          if(tagName == "INPUT"){
            var inputType = inputField.attr('type');
            if(inputType == "radio"){
              if(checkedRadioCheckboxSelectName[key] == null){
                var checkedObjects = $('[name=' + key + ']:checked', formObject);
                if(myDrawing.common.hasElements(checkedObjects)){
                  json[key] = checkedObjects.val();
                }else{
                  json[key] = "";
                }
              }
            }else if(inputType == "checkbox"){
              if(checkedRadioCheckboxSelectName[key] == null){
                var checkedObjects = $('[name=' + key + ']:checked', formObject);
                if(myDrawing.common.hasElements(checkedObjects)){
                  var checkedValues = [];
                  for(var i = 0,len= checkedObjects.length;i < len;i++){
                    checkedValues[i] = checkedObjects[i].val();
                  }
                  json[key] = checkedValues;
                }else{
                  json[key] = "";
                }
              }
            }else{
              json[key] = inputField.val();
            }
          }else if(tagName == "SELECT"){
            if(checkedRadioCheckboxSelectName[key] == null){
              var selectedObjects = $('[name=' + key + ']:selected', formObject);
              if(myDrawing.common.hasElements(selectedObjects)){
                json[key] = selectedObjects.val();
              }else{
                json[key] = "";
              }
            }
          }else if(tagName == "TEXTAREA"){
            json[key] = inputField.val();
          }
        }
      }
      if(json[myDrawing.D.LAST_MODIFIED_KEY] != null){
        json[myDrawing.D.LAST_MODIFIED_KEY] = myDrawing.date.getDatetime();
      }
      return json;
    },
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
      /*polygon.draggable().on('dragmove', function(e){
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
      });*/
      return polygon;
    },
    polygonDraggable: function(){
      return function(e){
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
      };
    },
  },
  storage:{
    load: function(key){
      return window.localStorage.getItem(key);
    },
    save: function(key, value){
      window.localStorage.setItem(key, value);
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
  },
  maintenance:{
    checkVersion: function(actionWhenVersionUp){
      var result = myDrawing.ajax.post("sampleJson/getCurrentVersion.json", null, function(data){
        if(gSetup[currentVersion] < data.currentVersion){
          actionWhenVersionUp();
        }
      });
    }
  }
};


$(function(){
  var gSetup = {};
  gSetup.isEditGraphObject = false;
  gSetup.magnification = 1;//1:1px=1cm, 10:1px=10cm, 100:1px=1m
  gSetup.landInfoId = -1;
  //var data = {};
  var landInfoList = {};
  var landDetailList = {};
  var svgObjects = {};
  var draw = null;
  var mySlidebar = null;

  /* グラフの罫線を引く */
  var makeMemori = function(targetSVGObject, direction, maxSize, maxMemoriSize){
    var x,y,memoriFunc;
    if(direction == 'x'){
      x = maxSize;
      y = 0;
      memoriFunc = function(draw, position, length, className){
        draw.line(position, 0, position, length).addClass(className);
        //return $('<path d="M ' + position + ',0 v ' + length + '" />');
      };

    }else{
      x = 0;
      y = maxSize;
      memoriFunc = function(draw, position, length, className){
        draw.line(0, position, length, position).addClass(className);
        //return $('<path d="M 0,' + position + ' h ' + length + '" />');
      };
    }
    //targetSVGObject.empty();
    for(var i = 0; i <= maxSize; i=i+10){
      if(i % 100 != 0){
        memoriFunc(targetSVGObject, i, maxMemoriSize, "subLine");
      }
    }
    for(var i = 0; i <= maxSize; i=i+100){
      memoriFunc(targetSVGObject, i, maxMemoriSize, "mainLine");
    }
    //var subLineGroup = $('<g class="subLine" stroke="#000" stroke-width="1">');
    targetSVGObject.line(0,0,x,y).addClass("mainLine");
  };

  /* グラフのメモリテキストを追加 */
  var makeMemoriText = function(targetSVGObject, direction, maxSize, maxTextSize){
    var x,y,memoriFunc;
    if(direction == 'x'){
      targetSVGObject.size(maxSize, maxTextSize + "rem");
      x = maxSize;
      y = 0;
      memoriFunc = function(draw, position, maxTextSize, className){
        var text = draw.plain(position / 100 * gSetup.magnification);
        text.x(position).dx(-text.width() / 2).y(0).addClass(className);
      };
    }else{
      targetSVGObject.size((maxTextSize + 3) + "rem", maxSize);
      x = 0;
      y = maxSize;
      memoriFunc = function(draw, position, maxTextSize, className){
        var text = draw.plain(position / 100 * gSetup.magnification);
        text.y(position).dy(-text.width() / 2).x(0).addClass(className);
      };
    }
    //targetSVGObject.empty();
    for(var i = 100; i <= maxSize; i=i+100){
      memoriFunc(targetSVGObject, i, maxTextSize, "graphMemoriText");
    }
  };

  /* ロカールストレージから、私用中の土地情報一覧取得 */
  var lReadPresentLandInfoList = function(){
    var jsonText = myDrawing.storage.load(myDrawing.D.LS.KEY_PRESENT_LAND_INFO_LIST);
    if(jsonText != null){
      landInfoList = JSON.parse(jsonText);
      drawLandInfo(landInfoList);
    }
  };

  var getLandInfoFromServer = function(){
    var result = myDrawing.ajax.post("sampleJson/landInfoSummaryList.json", null, function(data){
      if(landInfoList[myDrawing.D.LAST_MODIFIED_KEY] == null || landInfoList[myDrawing.D.LAST_MODIFIED_KEY] < data[myDrawing.D.LAST_MODIFIED_KEY]){
        landInfoList = data;
        myDrawing.storage.save(myDrawing.D.LS.KEY_PRESENT_LAND_INFO_LIST, JSON.stringify(landInfoList));
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
        mySlidebar.open('landInfo');
        myDrawing.common.resetAllInputField($("#f_landInfo"));
        //myDrawing.common.resetAllInputField($("#f_landInfo"),{"a":"default","checkbox2":["0", "1"],"checkbox":"2","radio2":"1","select2":"1"});
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

              clickEvent(this.id);
            }
          });
          polygon.on("dblclick", function(event){
            if(gSetup.isEditGraphObject){
              // Stop default action and bubbling
              event.stopPropagation();
              event.preventDefault();

              clickEvent(this.id);
            }
          });
        }
        svgObjects[polygon.id] = polygon;
      }
    }catch(e){
      console.log('[setLandInfoList error] ' + e.message);
    }
  }

  var clearAllGraph = function(){
    $('#xMemori').empty();
    $('#yMemori').empty();
    $('#drawing').empty();
  };

  //var rect = draw.rect(100, 100).attr({ fill: '#f06' });
  //rect.draggable();

  $('#dynamicButton').on("click", function(){
    if(gSetup.isEditGraphObject){
      gSetup.isEditGraphObject = false;
      for(var index in svgObjects){
        svgObjects[index].draggable(false);
      }
    }else{
      gSetup.isEditGraphObject = true;
      for(var index in svgObjects){
        svgObjects[index].draggable().on('dragmove', myDrawing.rect.polygonDraggable());
      }
    }
  });

  $('#makeObjectButton').on("click", function(){
    var fill = $('#patternImg_bg1').attr('src');
    var polygon = myDrawing.rect.makeNewPolygon(draw, '0,0 110,10 100,50 50,100', fill, { width: 1 }, gSetup, mySlidebar);

  });

  $('#landInfoClose').on("click", function(){
    mySlidebar.close('landInfo');
  });

  //土地情報サマリ更新処理
  $('#btn_landInfoUpdate').on("click", function(){
    var targetId = $('#landInfoId').val();
    //入力内容で更新
    landInfoList.root[targetId] = myDrawing.common.updateJSON(landInfoList.root[targetId], $("#f_landInfo"));
    var lastModified = landInfoList.root[targetId][myDrawing.D.LAST_MODIFIED_KEY];
    //サーバ側に更新内容の送信
    if(true){
      landInfoList.root[targetId][myDrawing.D.SERVER_LAST_MODIFIED_KEY] = lastModified;
    }
    //ローカル側に保存
    landInfoList[myDrawing.D.LAST_MODIFIED_KEY] = lastModified;
    myDrawing.storage.save(myDrawing.D.LS.KEY_PRESENT_LAND_INFO_LIST, JSON.stringify(landInfoList));
    mySlidebar.close('landInfo');
  });

  $('#btn_landDetailListOpen').on('click', function(){
      //alert("");
  });

  //init action
  mySlidebar = new slidebars();
  clearAllGraph();
  draw = SVG('drawing').size(2000, 2000);
  mySlidebar.init();
  gSetup.landInfoId = 1;

  makeMemoriText(SVG('xMemori'), "x", 2000, 1);
  makeMemoriText(SVG('yMemori'), "y", 2000, 1);
  makeMemori(draw, "x", 2000, 2000);
  makeMemori(draw, "y", 2000, 2000);


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