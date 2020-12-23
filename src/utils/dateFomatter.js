
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

export function stringToDate(dateStr, separator) {
  if (!separator) {
    separator = '-'
  }
  var dateArr = dateStr.split(separator)
  var year = parseInt(dateArr[0])
  var month
  if (dateArr[1].indexOf('0') === 0) {
    month = parseInt(dateArr[1].substring(1))
  } else {
    month = parseInt(dateArr[1])
  }
  var day = parseInt(dateArr[2])
  var date = new Date(year, month - 1, day)
  return date
}

export function stringToDateFormat(dateStr, separator, fmt) {
  if (!separator) {
    separator = '-'
  }
  var dateArr = dateStr.split(separator)
  var year = parseInt(dateArr[0])
  var month
  if (dateArr[1].indexOf('0') === 0) {
    month = parseInt(dateArr[1].substring(1))
  } else {
    month = parseInt(dateArr[1])
  }
  var day = parseInt(dateArr[2])
  var date = new Date(year, month - 1, day)
  return formatDate(date, fmt)
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
