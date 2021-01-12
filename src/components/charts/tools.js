/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
    if (document.addEventListener) {
      return function (element, event, handler) {
        if (element && event && handler) {
          element.addEventListener(event, handler, false)
        }
      }
    } else {
      return function (element, event, handler) {
        if (element && event && handler) {
          element.attachEvent('on' + event, handler)
        }
      }
    }
  })()
  
  /**
   * @description 解绑事件 off(element, event, handler)
   */
  export const off = (function () {
    if (document.removeEventListener) {
      return function (element, event, handler) {
        if (element && event) {
          element.removeEventListener(event, handler, false)
        }
      }
    } else {
      return function (element, event, handler) {
        if (element && event) {
          element.detachEvent('on' + event, handler)
        }
      }
    }
  })()

  //默认echarts的option
  export const baseOption = {
    grid:{
        left: '3%',
        right: '4%',
        bottom: 6,
        top:10,
        containLabel: true
      },
      tooltip:{
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    }
  }