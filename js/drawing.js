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
          }else{ //SELECT TEXTAREA
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
        if(!isLandDesign()){
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
    checkVersion: function(actionWhenVersionUp, localVersion){
      var result = myDrawing.ajax.post("sampleJson/getCurrentVersion.json", null, function(data){
        if(localVersion < data.currentVersion){
          actionWhenVersionUp();
        }
      });
    }
  }
};


$(function(){
  var d = {};
  d.gSetup = {};
  var tempSetup = {};
  d.gSetup.isEditGraphObject = false;
  d.gSetup.landSetup = {};
  d.gSetup.landSetup.magnification = 1;//1:1px=1cm, 10:1px=10cm, 100:1px=1m
  d.gSetup.landSetup.width = 20;
  d.gSetup.landSetup.height = 20;
  d.gSetup.landInfoId = -1;
  //var data = {};
  d.landInfoList = {};
  d.landDetailList = {};
  var svgObjects = {};
  var draw = null;
  var mySlidebar = null;

  /* グラフの罫線を引く */
  var makeMemori = function(targetSVGObject, direction, maxSize, maxMemoriSize){
    var x,y,memoriFunc;
    if(direction == 'x'){
      x = maxSize;
      y = 0;
      memoriFunc = function(targetSVGObject, position, length, className){
        targetSVGObject.line(position, 0, position, length).addClass(className);
        //return $('<path d="M ' + position + ',0 v ' + length + '" />');
      };

    }else{
      x = 0;
      y = maxSize;
      memoriFunc = function(targetSVGObject, position, length, className){
        targetSVGObject.line(0, position, length, position).addClass(className);
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
  var makeMemoriText = function(targetDiv, direction, maxSize, maxTextSize){
    var x,y,memoriFunc;
    if(direction == 'x'){
      targetDiv.css("width", maxSize + "px");
      targetDiv.css("height", maxTextSize + "rem");
      x = maxSize;
      y = 0;
      memoriFunc = function(targetDiv, position, maxTextSize, className){
        var text = $('<div>' + (position / 100 * d.gSetup.landSetup.magnification) + '</div>');
        text.addClass(className);
        text.css("position", "absolute");
        text.css("left", position + "px");
        text.css("top", "0px");
        text.css("line-height", "0");
        targetDiv.append(text);
      };
    }else{
      targetDiv.css("width", maxTextSize + "rem");
      targetDiv.css("height", maxSize + "px");
      targetDiv.css("top", "-" + maxSize + "px");
      x = 0;
      y = maxSize;
      memoriFunc = function(targetDiv, position, maxTextSize, className){
        var text = $('<div>' + (position / 100 * d.gSetup.landSetup.magnification) + '</div>');
        text.addClass(className);
        text.css("position", "absolute");
        text.css("top", position + "px");
        text.css("left", "0px");
        text.css("line-height", "0");
        targetDiv.append(text);
      };
    }
    //targetSVGObject.empty();
    for(var i = 100; i <= maxSize; i=i+100){
      memoriFunc(targetDiv, i, maxTextSize, "graphMemoriText");
    }
  };

  /* ロカールストレージから、使用中の土地情報一覧取得 */
  var lReadPresentLandInfoList = function(){
    var jsonText = myDrawing.storage.load(myDrawing.D.LS.KEY_PRESENT_LAND_INFO_LIST);
    if(jsonText != null){
      d.landInfoList = JSON.parse(jsonText);
    }
  };

  /* ロカールストレージから、使用中の土地情報一覧取得 */
  var lReadSetupInfo = function(){
    var jsonText = myDrawing.storage.load(myDrawing.D.LS.KEY_SETUP);
    if(jsonText != null){
      d.gSetup = JSON.parse(jsonText);
    }
  };

  var getLandInfoFromServer = function(callback){
    var result = myDrawing.ajax.post("sampleJson/landInfoSummaryList.json", null, function(data){
      if(d.landInfoList[myDrawing.D.LAST_MODIFIED_KEY] == null || d.landInfoList[myDrawing.D.LAST_MODIFIED_KEY] < data[myDrawing.D.LAST_MODIFIED_KEY]){
        d.landInfoList = data;
        myDrawing.storage.save(myDrawing.D.LS.KEY_PRESENT_LAND_INFO_LIST, JSON.stringify(d.landInfoList));
        callback(data);
      }else{
      callback(d.landInfoList);
      }
    });
  };

  var getSetupInfoFromServer = function(callback){
    var result = myDrawing.ajax.post("sampleJson/setup.json", null, function(data){
      if(d.gSetup[myDrawing.D.LAST_MODIFIED_KEY] == null || d.gSetup[myDrawing.D.LAST_MODIFIED_KEY] < data[myDrawing.D.LAST_MODIFIED_KEY]){
        d.gSetup = data;
        myDrawing.storage.save(myDrawing.D.LS.KEY_SETUP, JSON.stringify(d.gSetup));
        callback(data);
      }
      callback(d.gSetup);
    });
  };

  var landInfoEditClickEvent = function(id, event){
    if(!isLandDesign()){
      // Stop default action and bubbling
      event.stopPropagation();
      event.preventDefault();

      // Toggle the Slidebar with id 'landInfo'
      mySlidebar.open('landInfo');
      $('#btn_landDetailListOpen').show();
      myDrawing.common.resetAllInputField($("#f_landInfo"));
      //myDrawing.common.resetAllInputField($("#f_landInfo"),{"a":"default","checkbox2":["0", "1"],"checkbox":"2","radio2":"1","select2":"1"});
      myDrawing.common.setInputField($("#f_landInfo"), d.landInfoList.root[id]);
      //$('').val(landInfo[dkey.name]);
    }
  };

  var drawLandInfo = function(json){
    try{
      //var json = JSON.parse(jsonText);
      var list = json.root;
      var dkey = myDrawing.D.M.LI_S;
      for(var landInfoId in list){
        var landInfo = list[landInfoId];
        var svgType = landInfo[dkey.svgType];
        if(svgType === "4"){
          var polygon = myDrawing.rect.makePolygon(draw, landInfoId, myDrawing.common.convertSVGPlot(landInfo[dkey.abstractPlots], d.gSetup.landSetup.magnification),
           myDrawing.common.getBackground(landInfo[dkey.type]), { width: 1 }, d.gSetup);
          polygon.on("click", function(event){
            landInfoEditClickEvent(this.id, event);
          });
          // polygon.on("dblclick", function(event){
          //   if(isLandDesign()){
          //     // Stop default action and bubbling
          //     event.stopPropagation();
          //     event.preventDefault();

          //     clickEvent(this.id);
          //   }
          // });
          // polygon.on("dblTap", function(){
          //   if(isLandDesign()){
          //     // Stop default action and bubbling
          //     event.stopPropagation();
          //     event.preventDefault();
          //     alert("");
          //     clickEvent(this.id);
          //   }
          // });
          // polygon.on("", function(event)){

          // });
        }
        svgObjects[polygon.id] = polygon;
      }
    }catch(e){
      console.log('[setLandInfoList error] ' + e.message);
    }
  }

  var drawSVGMemori = function(json){
    var gSetup = json;
    var tempWidth = Math.round(gSetup.landSetup.width * 100 / gSetup.landSetup.magnification);
    var tempHeight = Math.round(gSetup.landSetup.height * 100 / gSetup.landSetup.magnification);
    tempSetup.svgConstraint = {minX:0, minY:0, maxX:tempWidth, maxY:tempHeight};

    draw = SVG('drawing').size(tempWidth, tempHeight);
    mySlidebar.init();
    gSetup.landInfoId = 1;

    makeMemoriText($('#xMemori'), "x", tempWidth, 1);
    makeMemoriText($('#yMemori'), "y", tempHeight, 1);
    makeMemori(draw, "x", tempWidth, tempHeight);
    makeMemori(draw, "y", tempHeight, tempWidth);
    $('#drawingDiv').css("max-height",  + tempHeight + 10 + "px");
  };

  var updateLandProts = function(landEle){
    var points = landEle.array().value;
    var p0Position = 0;
    var p0Length = Math.pow(points[0][0], 2) + Math.pow(points[0][1], 2)
    for(var h=1,maxLen=points.length; i < maxLen; h++){
      var tempLength = Math.pow(points[h][0], 2) + Math.pow(points[h][1], 2);
      if(p0Length > tempLength){
        p0Position = h;
        p0Length = tempLength;
      }
    }
    var landInfo = d.landInfoList.root[landEle.id];
    var presentProts = landInfo[myDrawing.D.M.LI_S.abstractPlots];
    for(var i=0,maxLen=presentProts.length; i < maxLen; i++){
      presentProts[i] = points[(p0Position + i) % maxLen];
    }
    landInfo[myDrawing.D.LAST_MODIFIED_KEY] = myDrawing.date.getDatetime();
  };

  var clearAllGraph = function(){
    $('#xMemori').empty();
    $('#yMemori').empty();
    $('#drawing').empty();
  };

  var isLandDesign = function(){
    if(tempSetup.landDesignTransform || tempSetup.landDesignMove){
      return true;
    }else{
      return false;
    }
  }
  var changeLandDesignDisable = function(){
    tempSetup.landDesignTransform　= undefined;
    tempSetup.landDesignMove = undefined;
  };
  //var rect = draw.rect(100, 100).attr({ fill: '#f06' });
  //rect.draggable();

  //農地編集 ツールバー表示
  $('#collapseLandDesignDiv').on('show.bs.collapse', function (){
    $('#setupIcon').hide();
    mySlidebar.close('setupMenu');
  });
  //農地編集 ツールバー閉じる
  $('#collapseLandDesignDiv').on('hide.bs.collapse', function (){
    $('#setupIcon').show();
  });

  $('#landDesignMove').on("click", function(){
    if(tempSetup.landDesignTransform){
      $('#landDesignTransform').trigger('click');
    }
    if(tempSetup.landDesignMove){
      tempSetup.landDesignMove = false;
      $(this).removeClass("active");
      $('i', this).hide();
      for(var index in svgObjects){
        svgObjects[index].draggable(false);
      }
    }else{
      tempSetup.landDesignMove = true;
      $(this).addClass("active");
      $('i', this).show();
      for(var index in svgObjects){
        //svgObjects[index].draggable().on('dragmove', myDrawing.rect.polygonDraggable());
        svgObjects[index].draggable(tempSetup.svgConstraint).on('dragend', function(e){
          updateLandProts(this);
        });
      }
    }
  });

  $('#landDesignTransform').on("click", function(){
    if(tempSetup.landDesignMove){
      $('#landDesignMove').trigger('click');
    }
    if(tempSetup.landDesignTransform){
      tempSetup.landDesignTransform = false;
      $(this).removeClass("active");
      $('i', this).hide();
      if(tempSetup.nowLandDesignTransform != null){
        tempSetup.nowLandDesignTransform.selectize(false).selectize(false, {deepSelect:true})
        .resize('stop');
        tempSetup.nowLandDesignTransform.off('click.landDesignTransform');
        tempSetup.nowLandDesignTransform = undefined;
      }
      for(var index in svgObjects){
        svgObjects[index].off('click.landDesignTransform');
      }
    }else{
      tempSetup.landDesignTransform = true;
      $(this).addClass("active");
      $('i', this).show();
      for(var index in svgObjects){
        svgObjects[index].on('click.landDesignTransform', function(event){
          if(tempSetup.nowLandDesignTransform != null){
            tempSetup.nowLandDesignTransform.selectize(false).selectize(false, {deepSelect:true}).resize('stop');
          }
          tempSetup.nowLandDesignTransform = this.selectize().selectize({deepSelect:true})
          .resize({constraint: tempSetup.svgConstraint}).on('resizedone', function(){
            updateLandProts(this);
          });
        });
      }
    }
  });
  //農地の新規作成
  $('#landDesignAdd').on("click", function(){
    if(tempSetup.landDesignMove){
      $('#landDesignMove').trigger('click');
    }
    if(tempSetup.landDesignTransform){
      $('#landDesignTransform').trigger('click');
    }
    var fill = "#ffffff";
    var polygon = myDrawing.rect.makeNewPolygon(draw, '0,0 110,10 100,50 50,100', fill, { width: 1 }, d.gSetup, mySlidebar);
    polygon.on("click", function(event){
      landInfoEditClickEvent(this.id, event);
    })
    polygon.id = d.gSetup.landInfoId;
    d.gSetup.landInfoId++;
    svgObjects[polygon.id] = polygon;
  });

  $('#landDesignSave').on("click", function(){
    myDrawing.storage.save(myDrawing.D.LS.KEY_PRESENT_LAND_INFO_LIST, JSON.stringify(d.landInfoList));
    if(tempSetup.landDesignMove){
      $('#landDesignMove').trigger('click');
    }
    if(tempSetup.landDesignTransform){
      $('#landDesignTransform').trigger('click');
    }
    $('#collapseLandDesignDiv').collapse('hide');
  });

  $('#landDesignCancel').on("click", function(){
    if(tempSetup.landDesignMove){
      $('#landDesignMove').trigger('click');
    }
    if(tempSetup.landDesignTransform){
      $('#landDesignTransform').trigger('click');
    }
    $('#collapseLandDesignDiv').collapse('hide');
  });

  $('#landInfoClose').on("click", function(){
    mySlidebar.close('landInfo');
    $('#btn_landDetailListOpen').hide();
  });

  //土地情報サマリ更新処理
  $('#btn_landInfoUpdate').on("click", function(){
    var targetId = $('#landInfoId').val();
    //入力内容で更新
    d.landInfoList.root[targetId] = myDrawing.common.updateJSON(d.landInfoList.root[targetId], $("#f_landInfo"));
    //typeに応じた背景を選択
    svgObjects[targetId].fill(myDrawing.common.getBackground(d.landInfoList.root[targetId][myDrawing.D.M.LI_S.type]));
    var lastModified = d.landInfoList.root[targetId][myDrawing.D.LAST_MODIFIED_KEY];
    //サーバ側に更新内容の送信
    if(true){
      d.landInfoList.root[targetId][myDrawing.D.SERVER_LAST_MODIFIED_KEY] = lastModified;
    }
    //ローカル側に保存
    d.landInfoList[myDrawing.D.LAST_MODIFIED_KEY] = lastModified;
    myDrawing.storage.save(myDrawing.D.LS.KEY_PRESENT_LAND_INFO_LIST, JSON.stringify(d.landInfoList));
    mySlidebar.close('landInfo');
    $('#btn_landDetailListOpen').hide();
  });

  $('#btn_landDetailListOpen').on('dblTap', function(){
    mySlidebar.open('landDetailList');
    $('#btn_landDetailListOpen').hide();
      //alert("");
    });

  $('#landDetailListClose').on("click", function(){
    mySlidebar.close('landDetailList');
    mySlidebar.open('landInfo');
    $('#btn_landDetailListOpen').show();
  });

  $('#setupIcon').on("click", function(){
    mySlidebar.open('setupMenu');
    $('#btn_landDetailListOpen').hide();
  });

  $('#setupMenuClose').on("click", function(){
    mySlidebar.close('setupMenu');
    $('#collapseLandSize').collapse('hide');
    $('#collapseLandMagnification').collapse('hide');
  });

  //setup 土地サイズ
  $('#collapseLandSize').on('show.bs.collapse', function (){
    //$('#collapseLandMagnification').collapse('hide');
    var form = $('#f_setupLandSize');
    myDrawing.common.resetAllInputField(form);
    //myDrawing.common.resetAllInputField($("#f_landInfo"),{"a":"default","checkbox2":["0", "1"],"checkbox":"2","radio2":"1","select2":"1"});
    myDrawing.common.setInputField(form, d.gSetup.landSetup);
  });

  //setup 土地 倍率
  $('#collapseLandMagnification').on('show.bs.collapse', function (){
    //$('#collapseLandSize').collapse('hide');
    var form = $('#f_setupLandMagnification');
    myDrawing.common.resetAllInputField(form);
    //myDrawing.common.resetAllInputField($("#f_landInfo"),{"a":"default","checkbox2":["0", "1"],"checkbox":"2","radio2":"1","select2":"1"});
    myDrawing.common.setInputField(form, d.gSetup.landSetup);
  });

  //土地 サイズ変更
  $('#setupLandSizeUpdate').on("click", function(){
    var form = $('#f_setupLandSize');
    //入力内容で更新
    d.gSetup.landSetup = myDrawing.common.updateJSON(d.gSetup.landSetup, form);
    var lastModified = myDrawing.date.getDatetime();
    //サーバ側に更新内容の送信
    if(true){
      d.gSetup[myDrawing.D.SERVER_LAST_MODIFIED_KEY] = lastModified;
    }
    //ローカル側に保存
    d.gSetup[myDrawing.D.LAST_MODIFIED_KEY] = lastModified;
    myDrawing.storage.save(myDrawing.D.LS.KEY_SETUP, JSON.stringify(d.gSetup));
    mySlidebar.close('setupMenu');
    $('#collapseLandSize').collapse('hide');
    $('#collapseLandMagnification').collapse('hide');
    changeLandDesignDisable();
    //SVG再描画
    clearAllGraph();
    drawSVGMemori(d.gSetup);
    drawLandInfo(d.landInfoList);
  });

  //土地 倍率変更
  $('#setupLandMagnificationUpdate').on("click", function(){
    var form = $('#f_setupLandMagnification');
    //入力内容で更新
    d.gSetup.landSetup = myDrawing.common.updateJSON(d.gSetup.landSetup, form);
    var lastModified = myDrawing.date.getDatetime();
    //サーバ側に更新内容の送信
    if(true){
      d.gSetup[myDrawing.D.SERVER_LAST_MODIFIED_KEY] = lastModified;
    }
    //ローカル側に保存
    d.gSetup[myDrawing.D.LAST_MODIFIED_KEY] = lastModified;
    myDrawing.storage.save(myDrawing.D.LS.KEY_SETUP, JSON.stringify(d.gSetup));
    mySlidebar.close('setupMenu');
    $('#collapseLandSize').collapse('hide');
    $('#collapseLandMagnification').collapse('hide');
    changeLandDesignDisable();
    //SVG再描画
    clearAllGraph();
    drawSVGMemori(d.gSetup);
    drawLandInfo(d.landInfoList);
  });

  //init action
  mySlidebar = new slidebars();
  lReadSetupInfo();
  clearAllGraph();

  getSetupInfoFromServer(function(json){drawSVGMemori(json)});
  lReadPresentLandInfoList();
  getLandInfoFromServer(function(json){drawLandInfo(json)});


  //var mySlidebar = new $.slidebars({
  //  siteClose: true,
  //  scrollLock: true
  //});
  if (!window.localStorage) {
    alert("ブラウザのローカルストレージを有効にしてください。");
  }


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