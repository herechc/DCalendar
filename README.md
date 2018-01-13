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
1. time

![](https://github.com/herechc/DCalendar/tree/master/demo/staticSource/date.gif)

2. pcik
![](https://github.com/herechc/DCalendar/tree/master/demo/staticSource/pick.gif)

3. area
![](https://github.com/herechc/DCalendar/tree/master/demo/staticSource/area.gif)


# todo
- use for pc and mobile
