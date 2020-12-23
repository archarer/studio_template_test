import request from '@/utils/request'

export function getAsyncRouter() {
  return request({
    url: window.Global.POWER_API + '/power/PowerPlatformMenu',
    method: 'get'
  })
}
