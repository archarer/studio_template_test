
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '../router'

axios.defaults.withCredentials = true
axios.defaults.crossDomain = true
// create an axios instance
const service = axios.create({
  baseURL: window.Global.BASE_API,
  timeout: 20000
  // withCredentials: true,
  // crossDomain: true
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (getToken()) {
    config.headers['User-Token'] = getToken()
  }
  var currPath = location.hash
  if (currPath.split('/').length > 2) {
    var pageCode = currPath.split('/')[1]
    config.headers['Manage-PageID'] = pageCode
  }
  if (window.Global.PRODUCTID && window.Global.PRODUCTID > 0) {
    config.headers['Manage-ProductID'] = window.Global.PRODUCTID
  }
  if (config.manageProductID > 0) {
    config.headers['Manage-ProductID'] = config.manageProductID
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
  /**
  * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
  * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
  */
    const code = response.data.ResultCode
    // 50014:Token 过期了 50012:其他客户端登录了 50008:非法的token
    if (code === 'NoLogin' || code === 'UserExpire' || code === 'DeviceExpire' || code === 'UserLimit') {
      Message({
        message: response.data.ResultMessage,
        type: 'error',
        duration: 5 * 1000
      })
      // 登出
      store.dispatch('FedLogOut').then(() => {
        router.push({ path: '/login' })
      })
    } else {
      return response
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service
