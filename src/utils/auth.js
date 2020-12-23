import Cookies from 'js-cookie'

export function getToken() {
  if (Cookies.get('UserID')) {
    return 'UserID=' + Cookies.get('UserID') + ';' + 'UserIDMD5=' + Cookies.get('UserIDMD5') + ';' + 'UserToken=' + Cookies.get('UserToken')
  }
}

export function setToken(userInfo) {
  if (process.env.ENV_CONFIG === 'dev') {
    Cookies.set('UserID', userInfo.UserID)
    Cookies.set('UserIDMD5', userInfo.UserIDMD5)
    Cookies.set('UserToken', userInfo.UserToken)
  } else {
    setCookie('UserID', userInfo.UserID)
    setCookie('UserIDMD5', userInfo.UserIDMD5)
    setCookie('UserToken', userInfo.UserToken)
  }
}
function setCookie(key, value) {
  var domain = location.host.substr(location.host.indexOf('.'), location.host.length)
  var date = new Date()
  var expiresDays = 10
  date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000)
  document.cookie = key + '=' + value + ';domain=' + domain + '; expires=' + date.toGMTString()
}

function delCookie(name) {
  var domain = location.host.substr(location.host.indexOf('.'), location.host.length)
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  document.cookie = name + '=;domain=' + domain + ';expires=' + exp.toGMTString()
}
export function removeToken() {
  if (process.env.ENV_CONFIG === 'dev') {
    Cookies.remove('UserID')
    Cookies.remove('UserIDMD5')
    Cookies.remove('UserToken')
    Cookies.remove('topmodule')
    Cookies.remove('sidebarStatus')
  } else {
    delCookie('UserID')
    delCookie('UserIDMD5')
    delCookie('UserToken')
    delCookie('topmodule')
    delCookie('sidebarStatus')
  }
}
