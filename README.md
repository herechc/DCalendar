# DCalendar
A datepicker of plug, not rely anymore, just javascript

# Documentation
``` javascript

var calendar = new DCalendar({
  id: '#demo',
  type: 'date',//default:date. other: datetime, time, ym, area
  throttle: 20,//control the slip speed
  minDate: '1900-1', // set min date
  maxDate: '1900-1', // set max date
  trigger: '.demo',// realy trigger element
  dataUrl: '',//mast require jquery, area json,
  triggerFn: callback,// trigger callback
  cancelFn: callback,//cancel callback
  name: '区域',// title name

})

```
## 效果
__1. time__

![](https://github.com/herechc/DCalendar/tree/master/demo/staticSource/date.gif)

__2. pcik__

![](https://github.com/herechc/DCalendar/tree/master/demo/staticSource/pick.gif)

__3. area__

![](https://github.com/herechc/DCalendar/tree/master/demo/staticSource/area.gif)

__1. 【基础新闻列表】最基本的下拉刷新使用__

![](https://minirefresh.github.io/minirefresh/staticresource/screenshoot/base_default.gif)
# todo
- use for pc and mobile
