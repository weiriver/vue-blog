import {Message} from 'element-ui'

// 权限过滤
let Auth
export const authFilter = function (val, arr) {
  if (!Auth) {
    Auth = sessionStorage.getItem('Auth')
  }
  return Auth.includes(val)
}
export const clearAuth = function () {
  Auth = undefined
}
// 重置，页面刷新使用
export const refreshReset = (global) => {
  global.$router.replace({
    path: '/refresh',
    query: {
      t: Date.now(),
      reset: true
    }
  })
}
// 时间戳转日期+时间
export const timestampToTime = function (timestamp) {
  if (!timestamp) {
    return ''
  } else {
    var date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    // var Y = date.getFullYear() + '-'
    // var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    // var D = date.getDate() + ' '
    var h = (date.getHours() >= 10 ? date.getHours() : String('0' + date.getHours())) + ':'
    var m = (date.getMinutes() >= 10 ? date.getMinutes() : String('0' + date.getMinutes())) + ':'
    var s = (date.getSeconds() >= 10 ? date.getSeconds() : String('0' + date.getSeconds()))
    return timesTampToDate(timestamp) + h + m + s
  }
}
// 时间戳转日期
export const timesTampToDate = function (value) {
  function add0(m) {
    return m < 10 ? '0' + m : m
  }

  if (value) {
    var time = new Date(value)
    var y = time.getFullYear()
    var m = time.getMonth() + 1
    var d = time.getDate()
    return `${y}-${add0(m)}-${add0(d)} `
  } else {
    return ''
  }
}
// 正整数验证, num为验证的值， dataFlag为判定的true(不合规) false(合规)
export const allPNum = function (num) {
  var type = '^[0-9]*[1-9][0-9]*$'
  var re = new RegExp(type)
  var dataFlag
  if (num.match(re) == null) {
    dataFlag = true
  } else {
    dataFlag = false
  }
  if (num === '') {
    dataFlag = false
  }
  return dataFlag
}
// 特殊字符， dataFlag为判定的true(不合规) false(合规)
export const specialStr = function (num) {
  var type = '[`~!@#$%^&*()=|{}\';\',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；”“\'。，、？]'
  var re = new RegExp(type)
  var dataFlag
  if (re.test(num)) {
    dataFlag = true
  } else {
    dataFlag = false
  }
  if (num === '') {
    dataFlag = true
  }
  return dataFlag
}

export const showMsg = (content, type = 'success') => {
  // Message.close()
  Message[type]({
    message: content,
    showClose: true
  })
}
// 正则校验
export const regexp = {
  isFixPhone: function (val) {
    return /^[0][0-9]{2,3}-[0-9]{5,10}(-[0-9]{2,4})?/.test(val)
  },
  isMobile: function (val) {
    return /^1[345678]\d{9}$/.test(val)
    // return /^1\d{10}$/.test(val)
    // return /^[1][0-9]{10}$ /.test(val)
  },
  isIDCard: function (val) {
    return /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(val)
  },
  isNumber: function (val) {
    return /^[0-9]*$/.test(val)
  },
  // 整数类型
  isInt: function (val) {
    return /^[0-9]*[1-9][0-9]*$/.test(val)
  },
  // 允许负数
  isMPNumber: function (val) {
    return /^(-)?[0-9]*$/.test(val)
  },
  isTwoPointNumber: function (val) {
    return /^\d+(\.\d{0,2})?$/.test(val)
  },
  isEmail: function (val) {
    return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(val)
  },
  // 密码验证,包含大小写，数字，字母，符号组合
  passwordValidate: (val) => {
    // return /^(?![A-Za-z0-9]+$)(?![a-z0-9\\W]+$)(?![A-Za-z\\W]+$)(?![A-Z0-9\\W]+$)[a-zA-Z0-9\\W]{6,}$/.test(val)
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/.test(val)
  }
}
// 获得本周本月本年的开始日期
// export const GetDateStart = {
//   getDateDetail(now) {
//     var nowDayOfWeek = now.getDay() // 今天本周的第几天
//     nowDayOfWeek = nowDayOfWeek === 0 ? 7 : nowDayOfWeek
//     var nowDay = now.getDate() // 当前日
//     var nowMonth = now.getMonth() // 当前月
//     var nowYear = now.getYear() // 当前年
//     nowYear += (nowYear < 2000) ? 1900 : 0 //
//     return {
//       nowYear,
//       nowMonth,
//       nowDay,
//       nowDayOfWeek
//     }
//   },
//   // 格局化日期：yyyy-MM-dd
//   formatDate(date) {
//     var myyear = date.getFullYear()
//     var mymonth = date.getMonth() + 1
//     var myweekday = date.getDate()
//
//     if (mymonth < 10) {
//       mymonth = '0' + mymonth
//     }
//     if (myweekday < 10) {
//       myweekday = '0' + myweekday
//     }
//     return (myyear + '-' + mymonth + '-' + myweekday)
//   },
//
//   // 获得本周的开端日期(周一）
//   getWeekStartDate(now) {
//     var {nowDayOfWeek} = this.getDateDetail(now)
//     var timestampOfDay = 1000 * 60 * 60 * 24
//     var weekStartDate = +now - (nowDayOfWeek - 1) * timestampOfDay
//     return this.formatDate(new Date(weekStartDate))
//   },
//
//   // 获得本月的开端日期
//   getMonthStartDate(now) {
//     var {nowYear, nowMonth} = this.getDateDetail(now)
//     var monthStartDate = new Date(nowYear, nowMonth, 1)
//     return this.formatDate(monthStartDate)
//   },
//
//   // 获得近三个月的开端日期
//   getNearlyThreeStartDate(now) {
//     var {nowYear, nowMonth} = this.getDateDetail(now)
//     var threeMonthBefore = ((nowMonth - 2) + 12) % 12
//     if (threeMonthBefore > nowMonth) {
//       nowYear--
//     }
//     var quarterStartDate = new Date(nowYear, threeMonthBefore, 1)
//     return this.formatDate(quarterStartDate)
//   },
//
//   // 获得本年的开端日期
//   getYearStartDate(now) {
//     var {nowYear} = this.getDateDetail(now)
//     var yearStartDate = new Date(nowYear, 0, 1)
//     return this.formatDate(yearStartDate)
//   }
// }
// 去除对象包裹
export const getTxt = function (val) {
  if (val && typeof val == 'object' && val.text) {
    return val.text
  }
  if (val === true || val === 'true') {
    return '是'
  }
  if (val === false || val === 'false') {
    return '否'
  }
  return val
}
// 数字转换成三位逗号分隔的样式
export const toThousands = function (number, toFixedNum = 2) {
  let num = parseFloat((number + '').replace(/[^\d.-]/g, '')).toFixed(toFixedNum) + ''
  let result = ''
  let tempLength = number.toString().length
  while (num.length > 3) {
    result = (num.length == tempLength ? '' : ',') + num.slice(-3) + result
    num = num.slice(0, num.length - 3)
  }
  if (num) {
    result = num + result
  }
  return result
}
// 面包屑
export const getBreadcrumbList = function (navList) {
  var openName = '1' // 左侧导航栏的第几级开关
  var activeName = '1-1' // 左侧导航栏的子菜单项目高亮
  var breadcrumbItemList = []
  // 页面刷新后，记录左侧导航栏的点击位置。
  var hash = location.hash.substr(1) // 获取hash值
  // if (!hash.includes('apply')) {
  if (!hash.includes('applyDetail?from')) {
    hash = hash.split('?')[0]
  }
  // console.log('hash', hash)
  if (navList) {
    for (var n = 0; n < navList.length; n++) {
      var nav = navList[n]
      var subNavList = nav.children
      if (subNavList) {
        for (var i = 0; i < subNavList.length; i++) {
          var subnav = subNavList[i]
          if (hash === subnav.link) {
            // console.log('第二层选中', subnav.link)
            activeName = subnav.num // 获得菜单项的序号编码，如'2-1'
            openName = nav.num // 获得菜单项的父级序号编码，如‘2’
            breadcrumbItemList = [
              {name: nav.name, to: ''},
              {name: subnav.name, to: subnav.link}
            ] // 设置面包屑
            // console.log('第二层选中返回值', {
            //   openName,
            //   activeName,
            //   breadcrumbItemList
            // })
            return {
              openName,
              activeName,
              breadcrumbItemList
            }
          }
          // 从描述字段里面拿到第三层的数据
          var lastNavList = []
          if (!subnav.childrenArray) {
            subnav.childrenArray = []
            var remark = subnav.remark
            var pathNameArray = remark ? remark.split(';') : []
            pathNameArray.forEach(function (e) {
              var pathName = e.split(':')
              var name = pathName[0]
              var link = pathName[1]
              subnav.childrenArray.push({
                name,
                link
              })
            })
          }
          lastNavList = subnav.childrenArray
          // 面包屑的第三层
          if (lastNavList && lastNavList.length > 0) {
            for (var j = 0; j < lastNavList.length; j++) {
              var lastNav = lastNavList[j]
              if (hash === lastNav.link) {
                activeName = subnav.num // 获得菜单项的序号编码，如'2-1'
                openName = nav.num // 获得菜单项的父级序号编码，如‘2’
                breadcrumbItemList = [
                  {name: nav.name, to: ''},
                  {name: subnav.name, to: subnav.link},
                  {name: lastNav.name, to: hash}
                ] // 设置面包屑
                return {
                  openName,
                  activeName,
                  breadcrumbItemList
                }
              }
              // /a/b/:id 的路由
              // if ((hash.indexOf(lastNav.link) > -1) && (lastNav.link.split('/').length === hash.split('/').length)) {
              //   activeName = subnav.num  // 获得菜单项的序号编码，如'2-1'
              //   openName = nav.num // 获得菜单项的父级序号编码，如‘2’
              //   breadcrumbItemList = [
              //     {name: nav.name, to: ''},
              //     {name: subnav.name, to: subnav.link},
              //     {name: lastNav.name, to: hash}
              //   ] // 设置面包屑
              // }
              var link = lastNav ? lastNav.link : ''
              if (link && link.slice(-1) === '/') {
                link += '\\w+'
              }
              var regex = new RegExp(link)
              if (regex.test(hash)) {
                activeName = subnav.num // 获得菜单项的序号编码，如'2-1'
                openName = nav.num // 获得菜单项的父级序号编码，如‘2’
                breadcrumbItemList = [
                  {name: nav.name, to: ''},
                  {name: subnav.name, to: subnav.link},
                  {name: lastNav.name, to: hash}
                ] // 设置面包屑
              }
            }
          }
        }
      }
    }
  }
  return {
    openName,
    activeName,
    breadcrumbItemList
  }
}
// 获得本周本月本年的开始日期
export const GetDateStart = {
  getDateDetail(now) {
    var nowDayOfWeek = now.getDay() // 今天本周的第几天
    nowDayOfWeek = nowDayOfWeek === 0 ? 7 : nowDayOfWeek
    var nowDay = now.getDate() // 当前日
    var nowMonth = now.getMonth() // 当前月
    var nowYear = now.getYear() // 当前年
    nowYear += (nowYear < 2000) ? 1900 : 0 //
    return {
      nowYear,
      nowMonth,
      nowDay,
      nowDayOfWeek
    }
  },
  // 格局化日期：yyyy-MM-dd
  formatDate(date) {
    var myyear = date.getFullYear()
    var mymonth = date.getMonth() + 1
    var myweekday = date.getDate()

    if (mymonth < 10) {
      mymonth = '0' + mymonth
    }
    if (myweekday < 10) {
      myweekday = '0' + myweekday
    }
    return (myyear + '-' + mymonth + '-' + myweekday)
  },
  // 获得本周的开端日期(周一）
  getWeekStartDate(now) {
    var {nowDayOfWeek} = this.getDateDetail(now)
    var timestampOfDay = 1000 * 60 * 60 * 24
    var weekStartDate = +now - (nowDayOfWeek - 1) * timestampOfDay
    return this.formatDate(new Date(weekStartDate))
  },

  // 获得本月的开端日期
  getMonthStartDate(now) {
    var {nowYear, nowMonth} = this.getDateDetail(now)
    var monthStartDate = new Date(nowYear, nowMonth, 1)
    return this.formatDate(monthStartDate)
  },

  // 获得近三个月的开端日期
  getNearlyThreeStartDate(now) {
    var {nowYear, nowMonth} = this.getDateDetail(now)
    var threeMonthBefore = ((nowMonth - 2) + 12) % 12
    if (threeMonthBefore > nowMonth) {
      nowYear--
    }
    var quarterStartDate = new Date(nowYear, threeMonthBefore, 1)
    return this.formatDate(quarterStartDate)
  },

  // 获得本年的开端日期
  getYearStartDate(now) {
    var {nowYear} = this.getDateDetail(now)
    var yearStartDate = new Date(nowYear, 0, 1)
    return this.formatDate(yearStartDate)
  }
}

export const dateFormat = (date, fmt) => {
  if (date == null || date == undefined) return ''
  date = new Date(date)
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

// UUID
export const UUID = function (len, radix = 16) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = []
  let i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data. At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}
