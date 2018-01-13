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

# todo
- use for pc and mobile
