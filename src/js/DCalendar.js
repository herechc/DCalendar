/**
 * DCalendar日期时间选择控件
 * 
 * version:1.0
 * 
 * author:陈汉川
 * 
 * git:https://github.com/herechc/DCalendar
 * 
 * Copyright 2018
 * 
 * Licensed under MIT
 * 
 * 创建于： 2018-1-4 09:13:14
 */
(function (root) {
  var sUserAgent = navigator.userAgent.toLowerCase(),
  isAndroid = sUserAgent.match(/android/i),
  isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
  hasTouch = 'ontouchstart' in window && !isTouchPad,
  // Events
  RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
  START_EV = hasTouch ? 'touchstart' : 'mousedown',
  MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
  END_EV = hasTouch ? 'touchend' : 'mouseup',
  CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup';

  var DCalendarIdCount = -1

  var _ = function DCalendar(options) {
    //引入DCalendar的计数器
    ++DCalendarIdCount;
    this.DCalendarIdCount = DCalendarIdCount
    var that = this;
    //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择
    this.type = options.type || 'date';
    //最终填充值
    this.trigger = options.trigger || undefined;
    this.triggerFn = options.triggerFn || undefined;
    this.cancelFn = options.cancelFn || undefined;
    this.name = options.name || ''
    // 插件扩展
    this.extend = options.extend
    //area的json
    this.dataUrl = options.dataUrl || '';
    this.areaData = null
    this.provinceIdx = 0
    this.cityIdx = 0
    this.areaIdx = 0
    // 月天数
    this.days = 31;
    // 现在时间
    this.newDate = new Date()
    this.nowYear = this.newDate.getFullYear()
    this.nowMonth = this.newDate.getMonth()
    this.nowDate = this.newDate.getDate()
    this.nowHours = this.newDate.getHours()
    this.nowMinutes = this.newDate.getMinutes()
    this.nowSeconds = this.newDate.getSeconds()
     //自动填充值
    this.autoFill = options.autoFill || false   
    // 节流控制
    this.throttle = options.throttle || 1
    //id
    this.id = options.id || ''
    //最大最小日期
    this.minDate = options.minDate || '1900-1';
    this.maxDate = options.maxDate || this.nowYear + '-' + (this.nowMonth + 1)
    this.minDateArr = this.minDate.split('-')
    this.maxDateArr = this.maxDate.split('-')
    // 年月日数组
    this.minYear = this.minDateArr[0]
    this.maxYear = this.maxDateArr[0]
    //body
    this.domBody = document.body
    //id
    if (this.id) {
      this.dom = this.selector(this.id)
    } else {
      throw new Error("id must be not empty")
      return
    }
    //初始化
    that.init()

    this.dom.addEventListener('touchend',function(){
      if(!!that.trigger && !!that.triggerFn){
        that.triggerFn()
      }
      that.show()
    })
  }
  _.prototype.init = function () {
    this.createDom()
    var that = this;
    switch (this.type) {
      case 'date':
        this.createDate();
        break;
      case 'datetime':
        this.createDatetime();
        break;
      case 'time':
        this.createTime();
        break;
      case 'ym':
        this.createYm();
        break;
      case 'pick':
        this.createPick();
        break;
      case 'area':
        this.createArea();
        break;    
      default:
        break;
    }
   
    this.handleBtn()

    //绑定事件
    this.bind('touchstart')
    this.bind('touchmove')
    this.bind('touchend')
  }
  _.prototype.createArea = function(){
    var that = this;
    if(!this.dataUrl && this.type != 'area') return false;
    var dom = [];
    var height = [];
    var $provhtml=$cityhtml=$areahtml = ''
    $.ajax({
      type:'GET',
      url:that.dataUrl,
      dataType:'json',
      success:function(data){
        that.areaData = data;
        var aData = data;
        for(var i = aData.length - 1; i >= 0; i--){
          $provhtml += '<div class="model" dc_index='+i+'>'+aData[i].name+'</div>'
        }
        height.push((aData.length-3)*40)
        dom.push($provhtml)
        var city = aData[that.provinceIdx].childs
        for(var j = 0; j < city.length; j++){
          $cityhtml += '<div class="model" dc_index='+j+'>'+city[j].name+'</div>'
        }
        height.push((city.length-3)*40)
        dom.push($cityhtml)
        var area = aData[that.provinceIdx].childs[that.cityIdx].childs
        for(var k = 0; k < area.length; k++){
          $areahtml += '<div class="model" dc_index='+k+'>'+area[k].name+'</div>'
        }

        height.push((area.length-3)*40)
        dom.push($areahtml)

       
        that.innerDom({
          'target':['.year_wrap','.month_wrap','.date_wrap'],
          'dom':[dom[0],dom[1],dom[2]],
          'trans':[height[0],height[1],height[2]]
        })
        that.toggle(['.block_4th','.block_5th'],"none")
        
      }
    })  
  }
  _.prototype.createPick = function(){
    if(!this.extend && this.type != 'pick') return false;
    var data = this.extend.data
    var height = [];
    var result = [];
    var buffer = '';
    for(var i = 0; i < data.length; i++){
      var selfData = data[i]
      buffer = ''
      height.push((selfData.length - 3) * 40);
      for(var j = 0; j < selfData.length; j++){
        buffer += '<div class="model">'+selfData[j]+'</div>'
      }
      result.push(buffer)
    }
    
    
    this.innerDom({
      'target':['.year_wrap','.month_wrap'],
      'dom':[result[0],result[1]],
      'trans':[height[0],height[1]]
    })
    this.toggle(['.block_3th','.block_4th','.block_5th'],"none")
  }
  //初始化dom数
  _.prototype.createDom = function(){
    var $html;
    var domlist = this.useDateDom()
    $html = '<div class="canlendar_mask"></div>' +
    '<div class="canlendar_body">' +
    '<div class="body_head">' +
    '<span class="calendar_name">'+this.name+'</span>' +
    '<span class="calendar_cancel">取消</span>' +
    '</div>' +
    '<div class="canlendar_block">' +
    ' <div class="canlendar_block_mask">' +
    ' <div class="block_bd block_first">' +
    '<div class="picker_wrap year_wrap">' +
    '</div>' +
    '<div class="fence"></div>' +
    '</div>' +
    '<div class="block_bd block_second">' +
    '<div class="picker_wrap month_wrap">' +
    '</div>' +
    '<div class="fence"></div>' +
    '</div>' +
    '<div class="block_bd block_3th">' +
    '<div class="picker_wrap date_wrap">' +
    '</div>' +
    '<div class="fence"></div>' +
    '</div>' +
    '<div class="block_bd block_4th">' +
    '<div class="picker_wrap hours_wrap">' +
    '</div>' +
    '<div class="fence">时</div>' +
    '</div>' +
    '<div class="block_bd block_5th">' +
    '<div class="picker_wrap minutes_wrap">' +
    '</div>' +
    '<div class="fence">分</div>' +
    '</div>' +
    '</div>' +
    ' </div>' +
    '</div>';
    this.DcDIV.innerHTML = $html

    var domYearTransHeight = (this.maxYear - this.minYear - 2)*40;
    var domMonthTransHeight = (12 - 3)*40;
    var domDateTransHeight = (this.days - 3)*40;
    var domHoursTransHeight = (24 - 2)*40;
    var domMinutesTransHeight = (60 - 2)*40;

    this.innerDom({
      'target':['.year_wrap','.month_wrap','.date_wrap','.hours_wrap','.minutes_wrap'],
      'dom':[domlist.domYear,domlist.domMonth,domlist.domDay,domlist.domHours,domlist.domMinutes],
      'trans':[domYearTransHeight,domMonthTransHeight,domDateTransHeight,domHoursTransHeight,domMinutesTransHeight]
    })

  }
  // 创建年月时间dom，重复利用
  _.prototype.useDateDom = function(){
    var DcDIV;
    //年月日
    var domYear = '';
    var domMonth = '';
    var domDay = '';
    var domHours = '';
    var domMinutes = ''

    // 年
    for(var i = this.minYear; i <= this.maxYear; i++){
      domYear += '<div class="year">'+i+'</div>'
    }
    // 月
    for(var i = 1; i <= 12; i++){
      domMonth += '<div class="month">'+i+'</div>'
    }
    // 日
    for(var i = 1; i <= this.days; i++){
      domDay += '<div class="date">'+i+'</div>'
    }
    //小时
    for(var i = 0; i <= 24; i++){
      domHours += '<div class="hours">'+i+'</div>'
    } 
    //分钟
    for(var i = 0; i <= 60;i++){
      domMinutes += '<div class="minutes">'+i+'</div>'
    }
    // 创建DCalendar的dom
    this.DcDIV = document.createElement("div")
    this.DcDIV.className = 'DCalendar'

    this.domBody.appendChild(this.DcDIV)
    return {
      'domYear':domYear,
      'domMonth':domMonth,
      'domDay': domDay,
      'domHours':domHours,
      'domMinutes':domMinutes,
      'domTarget': this.DcDIV
    }
  }
  // dom显示~隐藏
  _.prototype.toggle = function(cls,toggle){
    if(!cls) return;
    if(cls.length){
      if(Object.prototype.toString.call(cls) === '[object Array]'){
        for(var i = 0; i < cls.length; i++){
          this.selector(cls[i]).style.display = toggle
        }
      } else {
        this.selector(cls).style.display = toggle
      }
    } else {
      cls.style.display = toggle
    }
  }
  // 创建date模式
  _.prototype.createDate = function () {
    this.toggle(['.block_4th','.block_5th'],"none")
  }
  //创建Datetime模式
  _.prototype.createDatetime = function(){
    console.log('default')
  }
  //创建time模式
  _.prototype.createTime = function(){
    this.toggle(['.block_first','.block_second','.block_3th'],"none")
  }
  //创建ym模式
  _.prototype.createYm = function(){
    this.toggle(['.block_3th','.block_4th','.block_5th'],"none")
  }
  // 设置位移
  _.prototype.setTranslate = function(ele,val){
    var _ele = ele
    if(!_ele) return;
    if(_ele.length && typeof(_ele) != 'string'){
      for(var i = 0; i < _ele.length; i++){
        val[i] = -Number(val[i])
        this.selector(_ele[i]).style.WebkitTransform ='translate3d(0, '+val[i]+'px,0)'
        this.selector(_ele[i]).setAttribute('top', val[i])
        this.selector(_ele[i])['old_top'] = val[i]
      }
    }else{
      if(typeof(_ele) == 'string'){
        val = -Number(val)
        this.selector(_ele).style.WebkitTransform ='translate3d(0, '+val+'px,0)'
        this.selector(_ele).setAttribute('top', val)
        this.selector(_ele)['old_top'] = val
      }else{
        _ele.style.WebkitTransform ='translate3d(0, '+val+'px,0)'
        _ele.setAttribute('top', val)
      }
    }
  }
  // 选择器
  _.prototype.selector=function(e){
    var that= this;
    var eLen = document.querySelectorAll(e).length
    return eLen > 1 ?  document.querySelectorAll(e)[that.DCalendarIdCount] : document.querySelectorAll(e)[0];
  }
  _.prototype.selectorAll = function(e){
    return document.querySelectorAll(e)
  }
  //绑定事件
  _.prototype.handleEvent = function(e){
    var that = this
    switch(e.type){
      case 'touchstart': 
        that.handleStart(e); break;
      case 'touchmove':
        that.handleMove(e); break;
      case 'touchend':
        that.handleEnd(e); break;
      default:
        break;  
    }
  }
  //绑定事件
  _.prototype.bind = function(type,bubble){
    document.body.addEventListener(type,this,!!bubble)
  }
  // 手指事件-触摸开始
  _.prototype.handleStart = function(e){
    var target = e.target.parentNode
    if(!target.classList.contains('picker_wrap')) return;
    var point = e.targetTouches[0]
    //old_y起始值
    target['old_y'] = point.screenY;
  }
  // 手指事件-触摸移动
  _.prototype.handleMove = function(e){
    var moveY
    var target = e.target.parentNode
    var point = e.targetTouches[0]
    if(!target.classList.contains('picker_wrap')) return;
    // move_y移动中的值
    target['move_y'] = point.screenY;
    // moveY 移动的值
    moveY = (target['move_y'] - target['old_y']) / this.throttle + Number(target.getAttribute('top'))
    target['now_y'] = moveY
    this.setTranslate(target,moveY)
    target['old_y'] = target['move_y']
  }
  // 手指事件-触摸结束
  _.prototype.handleEnd = function(e){
    var target = e.target.parentNode
    if(!target.classList.contains('picker_wrap')) return;
    target['old_y'] = target['move_y']
    target.setAttribute("top", target['now_y'])
    this.computedPos(target, target['now_y'])
    //滑动结束
    this.rollTrigger(target)
  }
  // 计算位移
  _.prototype.computedPos = function(ele,posY){
    var reset;
    var range = Math.floor(posY / 40)
    var diff = posY % 40
    //
    if (posY > 80) {
      reset = 80;
    } else if(posY < ele['old_top']) {
      reset = ele['old_top']
    } else if(posY < 0){
      reset = diff > 20 ? (range - 1) * 40 : (range * 40)
    }else{
      reset = diff > 20 ? (range + 1) * 40 : (range * 40)
    }
    this.setTranslate(ele, reset)
    // this.holeVal()
  }
  //插入dom
  _.prototype.innerDom = function(opt){
    var len = opt.target.length
    if(opt.target && opt.dom){
      if(Object.prototype.toString.call(opt.target) === '[object Array]'){
        for(var i = 0; i < len; i++){
          this.selector(opt.target[i]).innerHTML = opt.dom[i]
        }
      }else{
        this.selector(opt.target).innerHTML = opt.dom
      }
    }
    if(opt.target && opt.trans){
      this.setTranslate(opt.target,opt.trans)
    }
  }
  //滚动结束触发
  _.prototype.rollTrigger = function(e){
    var that = this
    var dateDom = this.selector('.date_wrap').childNodes
    var hole = this.holeVal()
    var areaHole = []
    if((this.type == 'date' || this.type == 'datetime') && !e.classList.contains("date_wrap")){
      // 日期
      var domDay = '';
      var year = hole[0].ele.innerHTML
      var month = hole[1].ele.innerHTML;
      // 获取多少天
      var day = (new Date(year,month,0)).getDate()
      // 日
      for(var i = 0; i < day; i++){
        this.toggle(dateDom[i],'block')
      }
      for(var i = day; i < dateDom.length; i++){
        this.toggle(dateDom[i],'none')
      }
      
      var trans = (day - 3) * 40
      
      this.innerDom({
        'target':'.date_wrap',
        'dom': null,
        'trans': trans
      })
    }

    if(this.type == 'area' && !!this.areaData){
      
      var prov = hole[0].ele.getAttribute('dc_index')
      var city;
      var cityData = that.areaData[prov].childs
      var area;
      var areaData
  
      var $cityhtml=$areahtml=''

      var cityTrans;
      var areaTrans;

      if(e.classList.contains("year_wrap")){
        for(var z = 0; z < cityData.length; z++){
          $cityhtml += '<div class="model" dc_index='+z+'>'+cityData[z].name+'</div>';
          if(z == cityData.length-1){
            areaHole.push(cityData[z].name)
          }
        }
        city = that.areaData[prov].childs.length - 1
        area = that.areaData[prov].childs[city].childs.length - 1
        areaData = that.areaData[prov].childs[city].childs
        for(var y = 0; y < areaData.length; y++){
          $areahtml += '<div class="model" dc_index='+y+'>'+areaData[y].name+'</div>'
          if(y == areaData.length-1){
            areaHole.push(areaData[y].name)
          }
        }
        cityTrans = (city - 2)*40;
        areaTrans = (area - 2)*40
        this.innerDom({
          'target':['.month_wrap','.date_wrap'],
          'dom':[$cityhtml,$areahtml],
          'trans':[cityTrans,areaTrans]
        })
      }else if(e.classList.contains('month_wrap')){
        city = hole[1].ele.getAttribute('dc_index')
        area = that.areaData[prov].childs[city].childs.length - 1
        areaData = that.areaData[prov].childs[city].childs
        for(var y = 0; y < areaData.length; y++){
          $areahtml += '<div class="model" dc_index='+y+'>'+areaData[y].name+'</div>'
          if(y == areaData.length-1){
            areaHole = []
            areaHole.push(areaData[y].name)
          }
        }
        areaTrans = (area - 2)*40
        this.innerDom({
          'target':['.date_wrap'],
          'dom':[$areahtml],
          'trans':[areaTrans]
        })
      }else{
        areaHole = []
      }
      
    }
    // console.log(cityData,areaData)
    //自动填充值
    if(this.autoFill){
      // var hole = that.holeVal()
      var result = ''
      var conform = '';
      
      if(this.extend){
        var len = Object.keys(hole).length - 1
        for(var i in hole){
          if(i < len){
            conform += result + hole[i].ele.innerHTML + ' > '
          }else{
            conform = conform + hole[i].ele.innerHTML
          } 
        }
      } else if(this.type == 'area'){
        if(areaHole.length == 2){
          conform = hole[0].ele.innerHTML + '-' + areaHole[0] + '-' + areaHole[1]
        }else if(areaHole.length == 1){
          conform = hole[0].ele.innerHTML + '-' + hole[1].ele.innerHTML + '-' + areaHole[0]
        }else{
          var len = Object.keys(hole).length - 1
          for(var i in hole){
            if(i < len){
              conform += result + hole[i].ele.innerHTML + ' - '
            }else{
              conform += hole[i].ele.innerHTML
            } 
          }
        }
      } else {
        for(var i in hole){
          if(hole[i].ele.innerHTML < 10){
            result += '0' + hole[i].ele.innerHTML
          }else{
            result += hole[i].ele.innerHTML
          }
        }
        switch(result.length){
          case 8:
            conform = result.replace(/(?=(\d{2}){1,2}$)/g,'-');
            break;
          case 6:
            conform = result.replace(/(?=(\d{2}){2 }$)/g,'-');  
            break;
          case 12:
            conform = result.replace(/(?=(\d{2}){1,4}$)/g,'-');  
            break;
          default:
            conform = result;
            break;
        }
      }
      if(this.trigger){
        this.selector(this.trigger).value = conform
      }else{
        that.dom.value = conform
      }
    }
  }
  // 框里面的值
  _.prototype.holeVal = function(){
    var result = {};
    var pos = 0;
    var targetChild;
    var filter = []
    var targetArr = document.querySelectorAll(".picker_wrap")
    for(var j = (this.DCalendarIdCount * 5); j < (this.DCalendarIdCount * 5 + 5); j++){
      var node = targetArr[j].parentNode
      if(node.style.display != 'none'){
        filter.push(targetArr[j])
      }
    }
    // console.log('filter',filter)
    
    for(var i = 0; i < filter.length; i++){
      var _target =  filter[i]
      var top = _target.getAttribute('top')
      var childs = _target.childNodes
      pos = parseInt((top - 80) / -40)
      targetChild = childs[pos]
      result[i] = {'index': pos, 'ele': targetChild}
    }
    return result
  }
  // 取消
  _.prototype.handleBtn = function(){
    var that = this
    
    this.selector('.calendar_cancel').addEventListener("touchend",function(){
      that.hide()
      if(that.cancelFn){
        that.cancelFn()
      }
    })
    // this.selector('.calendar_submit').addEventListener("touchend",function(){
    //   var hole = that.holeVal()
    //   var result = ''
    //   for(var i in hole){
    //     if(hole[i].ele.innerHTML < 10){
    //       result += '0' + hole[i].ele.innerHTML
    //     }else{
    //       result += hole[i].ele.innerHTML
    //     }
    //   }
    //   var conform = result.replace(/(?=(\d{2}){1}$)/g,'-')
    //   that.dom.value = conform
    //   that.hide()
    // })
  }
  //显示
  _.prototype.show = function(){
    var that = this;
    this.DcDIV.style.display = 'block'
    //定时器
    var transTime = setInterval(function(){
      if(that.selector('.DCalendar')){
        that.selector('.canlendar_body').style['WebkitTransform'] = 'translate3d(0,0,0)'
        clearInterval(transTime)
      }
    },80)
    document.documentElement.style.overflow = "hidden"
  }
  //隐藏
  _.prototype.hide = function(){
    this.DcDIV.style.display = 'none'
    document.documentElement.style.overflow = "auto"
    this.selector('.canlendar_body').style['WebkitTransform'] = 'translate3d(0,100%,0)'
  }
  root.DCalendar = _

})(window)