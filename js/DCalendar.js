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
    this.type = options.type || 'date';
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
      default:
        break;
    }
   
    this.handleBtn()

    //绑定事件
    this.bind('touchstart')
    this.bind('touchmove')
    this.bind('touchend')
  }
  //初始化dom数
  _.prototype.createDom = function(){
    var $html;
    var domlist = this.useDateDom()
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

    var domYearTransHeight = (this.maxYear - this.minYear - 2)*2;
    var domMonthTransHeight = (12 - 3)*2;
    var domDateTransHeight = (this.days - 3)*2;
    var domHoursTransHeight = (24 - 2)*2;
    var domMinutesTransHeight = (60 - 2)*2;

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
        this.selector(cls)
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
        this.selector(_ele[i]).style.WebkitTransform ='translate3d(0, -'+val[i]+'em,0)'
        this.selector(_ele[i]).setAttribute('top', -val[i])
        this.selector(_ele[i])['old_top'] = -val[i]
      }
    }else{
      if(typeof(_ele) == 'string'){
        this.selector(_ele).style.WebkitTransform ='translate3d(0, -'+val+'em,0)'
        this.selector(_ele).setAttribute('top', -val)
        this.selector(_ele)['old_top'] = -val
      }else{
        _ele.style.WebkitTransform ='translate3d(0, '+val+'em,0)'
        _ele.setAttribute('top', val)
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
    var dateDom = this.selector('.date_wrap').childNodes
    if(e.classList.contains("date_wrap")) return;
    var hole = this.holeVal()
    if(this.type == 'date'){
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
      
      var trans = (day - 3) * 2
      
      this.innerDom({
        'target':'.date_wrap',
        'dom': null,
        'trans': trans
      })
    }
  }
  // 框里面的值
  _.prototype.holeVal = function(){
    var result = {};
    var pos = 0;
    var targetChild;
    var filter = []
    var targetArr = document.querySelectorAll(".picker_wrap")
    for(var j = 0; j < targetArr.length; j++){
      var node = targetArr[j].parentNode
      if(node.style.display != 'none'){
        filter.push(targetArr[j])
      }
    }
    
    for(var i = 0; i < filter.length; i++){
      var _target =  filter[i]
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
      that.hide()
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
      var conform = result.replace(/(?=(\d{2}){1}$)/g,'-')
      that.dom.value = conform
      that.hide()
    })
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
  }
  //隐藏
  _.prototype.hide = function(){
    this.DcDIV.style.display = 'none'
    this.selector('.canlendar_body').style['WebkitTransform'] = 'translate3d(0,100%,0)'
  }
  root.DCalendar = _

})(window)