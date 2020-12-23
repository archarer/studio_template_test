import request from '@/utils/request'

export function loginByUsername(account, password) {
  return request({
    url: window.Global.POWER_API + '/power/loginPlatform',
    method: 'get',
    params: { account: account, password: password }
  })
}
export function loginByUsernameGeetest(account, password, challenge, validate, seccode) {
  return request({
    url: window.Global.POWER_API + '/power/loginPlatform',
    method: 'get',
    params: { account: account, password: password, challenge: challenge, validate: validate, seccode: seccode }
  })
}
export function logout() {
  return request({
    url: window.Global.POWER_API + '/power/logout',
    method: 'post'
  })
}

