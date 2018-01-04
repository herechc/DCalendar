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


  var _ = function DCalendar(options) {
    var that = this;
    //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择
    this.type = 'date';
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
    // 节流控制
    this.throttle = options.throttle || 20
    //id
    this.id = options.id || ''
    //最大最小日期
    this.minDate = options.minDate || '1900-1';
    this.maxDate = options.maxDate || this.nowYear + '-' + (this.nowMonth + 1)
    this.minDateArr = this.minDate.split('-')
    this.maxDateArr = this.maxDate.split('-')
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
    this.dom.addEventListener('touchend',function(){
      that.init()
    })
  }
  _.prototype.init = function () {
    var that = this;
    switch (this.type) {
      case 'date':
        this.createDate();
      // case 'datetime':
      //   this.createDatetime();
      // case 'time':
      //   this.createTime();
      // case 'ym':
      //   this.createYm();
      default:
        break;
    }
    //定时器
    var transTime = setInterval(function(){
      if(that.selector('.DCalendar')){
        that.selector('.canlendar_body').style['WebkitTransform'] = 'translate3d(0,0,0)'
        clearInterval(transTime)
      }
    },200)
    this.handleBtn()
  }
  // 创建date模式
  _.prototype.createDate = function () {
    var DcDIV,$html;
    var domYear = '';
    var domMonth = '';
    var domDay = '';
    var minYear = this.minDateArr[0]
    var maxYear = this.maxDateArr[0]
    // 年
    for(var i = minYear; i <= maxYear; i++){
      domYear += '<div class="year">'+i+'</div>'
    }
    // 创建DCalendar的dom
    this.DcDIV = document.createElement("div")
    this.DcDIV.className = 'DCalendar'
    // 月
    for(var i = 1; i <= 12; i++){
      domMonth += '<div class="month">'+i+'</div>'
    }
    // 日
    for(var i = 1; i <= this.days; i++){
      domDay += '<div class="date">'+i+'</div>'
    }
    $html = '<div class="canlendar_mask"></div>' +
    '<div class="canlendar_body">' +
    '<div class="body_head">' +
    '<span class="calendar_cancel">取消</span>' +
    '<span class="calendar_submit">确定</span>' +
    '</div>' +
    '<div class="canlendar_block">' +
    ' <div class="canlendar_block_mask">' +
    ' <div class="block_bd block_first">' +
    '<div class="picker_wrap year_wrap">' +
    '</div>' +
    '<div class="fence">年</div>' +
    '</div>' +
    '<div class="block_bd block_second">' +
    '<div class="picker_wrap month_wrap">' +
    '</div>' +
    '<div class="fence">月</div>' +
    '</div>' +
    '<div class="block_bd block_3th">' +
    '<div class="picker_wrap date_wrap">' +
    '</div>' +
    '<div class="fence">日</div>' +
    '</div>' +
    '</div>' +
    ' </div>' +
    '</div>';
    this.DcDIV.innerHTML = $html
    this.domBody.appendChild(this.DcDIV)

    var domYearTransHeight = (maxYear - minYear - 2)*2;
    var domMonthTransHeight = (12 - 3)*2;
    var domDateTransHeight = (this.days - 3)*2;

    this.innerDom({
      'target':['.year_wrap','.month_wrap','.date_wrap'],
      'dom':[domYear,domMonth,domDay],
      'trans':[domYearTransHeight,domMonthTransHeight,domDateTransHeight]
    })

    //绑定事件
    this.bind('touchstart')
    this.bind('touchmove')
    this.bind('touchend')
  }
  // 设置位移
  _.prototype.setTranslate = function(ele,val){
    if(!ele) return;
    if(ele.length && typeof(ele) != 'string'){
      for(var i = 0; i < ele.length; i++){
        this.selector(ele[i]).style.WebkitTransform ='translate3d(0, -'+val[i]+'em,0)'
        this.selector(ele[i]).setAttribute('top', -val[i])
        this.selector(ele[i])['old_top'] = -val[i]
      }
    }else{
      if(typeof(ele) == 'string'){
        this.selector(ele).style.WebkitTransform ='translate3d(0, -'+val+'em,0)'
        this.selector(ele).setAttribute('top', -val)
        this.selector(ele)['old_top'] = -val
      }else{
        ele.style.WebkitTransform ='translate3d(0, '+val+'em,0)'
        ele.setAttribute('top', val)
      }
    }
  }
  // 选择器
  _.prototype.selector=function(e){
    return document.querySelector(e)
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
  _.prototype.bind = function(type,bubble){
    document.body.addEventListener(type,this,!!bubble)
  }
  // 手指事件
  _.prototype.handleStart = function(e){
    var target = e.target.parentNode
    if(!target.classList.contains('picker_wrap')) return;
    var point = e.targetTouches[0]
    //old_y起始值
    target['old_y'] = point.screenY;
  }
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
    if (posY > 4) {
      reset = 4;
    } else if(posY < ele['old_top']) {
      reset = ele['old_top']
    } else if(parseInt(posY) % 2 != 0){
      if(posY < 0){
        reset = Math.floor(posY)
      }else{
        reset = Math.ceil(posY)
      }
    } else {
      if(posY < 0){
        reset = Math.ceil(posY)
      }else{
        reset = Math.floor(posY)
      }
    }
    if(reset % 2 != 0) reset -= 1;
    this.setTranslate(ele, reset)
    this.holeVal()
  }
  //插入dom
  _.prototype.innerDom = function(opt){
    if(!opt.target) return;
    if(Object.prototype.toString.call(opt.target) === '[object Array]'){
      for(var i = 0; i < opt.target.length; i++){
        this.selector(opt.target[i]).innerHTML = opt.dom[i]
      }
    }else{
      this.selector(opt.target).innerHTML = opt.dom
    }
    if(opt.trans){
      this.setTranslate(opt.target,opt.trans)
    }
  }
  //滚动结束触发
  _.prototype.rollTrigger = function(e){
    if(e.classList.contains("date_wrap")) return;
    var hole = this.holeVal()
    if(this.type == 'date'){
      var domDay = '';
      var year = hole[0].ele.innerHTML
      var month = hole[1].ele.innerHTML;
      // 获取多少天
      var day = (new Date(year,month,0)).getDate()
      // 日
      for(var i = 1; i <= day; i++){
        domDay += '<div class="date">'+i+'</div>'
      }
      var trans = (day - 3) * 2
      
      this.innerDom({
        'target':'.date_wrap',
        'dom': domDay,
        'trans': trans
      })
    }
  }

  // 框里面的值
  _.prototype.holeVal = function(){
    var result = {};
    var pos = 0;
    var targetChild;
    var targetArr = document.querySelectorAll(".picker_wrap")
    for(var i = 0; i < targetArr.length; i++){
      var _target =  targetArr[i]
      var top = _target.getAttribute('top')
      var childs = _target.childNodes
      pos = parseInt((top - 4) / -2)
      targetChild = childs[pos]
      result[i] = {'index': pos, 'ele': targetChild}
    }
    return result
  }
  // 取消
  _.prototype.handleBtn = function(){
    var that = this
    
    this.selector('.calendar_cancel').addEventListener("touchend",function(){
      that.domBody.removeChild(that.DcDIV)
    })
    this.selector('.calendar_submit').addEventListener("touchend",function(){
      var hole = that.holeVal()
      var result = ''
      for(var i in hole){
        if(hole[i].ele.innerHTML < 10){
          result += '0' + hole[i].ele.innerHTML
        }else{
          result += hole[i].ele.innerHTML
        }
      }
      var conform = result.replace(/(?=(\d{2}){1,2}$)/g,'-')
      that.dom.value = conform
      that.domBody.removeChild(that.DcDIV)
    })
  }

  root.DCalendar = _

})(window)