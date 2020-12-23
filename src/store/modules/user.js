import { loginByUsername, loginByUsernameGeetest, logout } from '@/api/login'
import { setToken, removeToken } from '@/utils/auth'
import { Message } from 'element-ui'

const user = {
  state: {
    userID: '',
    userIDMD5: '',
    userToken: ''
  },

  mutations: {
    SET_USERINFO: (state, userinfo) => {
      state.userID = userinfo.UserID
      state.userIDMD5 = userinfo.UserIDMD5
      state.userToken = userinfo.UserToken
    },
    Clear_USERINFO: (state) => {
      state.userID = ''
      state.userIDMD5 = ''
      state.userToken = ''
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          if (response.data.ResultCode !== '0') {
            Message.error(response.data.ResultMessage)
          } else {
            Message.success('登录成功')
            const data = response.data.Data
            commit('SET_USERINFO', data)
            setToken(data)
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    LoginByUsernameGeetest({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsernameGeetest(username, userInfo.password, userInfo.challenge, userInfo.validate, userInfo.seccode).then(response => {
          if (response.data.ResultCode !== '0') {
            Message.error(response.data.ResultMessage)
          } else {
            Message.success('登录成功')
            const data = response.data.Data
            commit('SET_USERINFO', data)
            setToken(data)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('Clear_USERINFO')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('Clear_USERINFO')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
