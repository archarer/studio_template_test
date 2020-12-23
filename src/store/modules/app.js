import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    isLogOperation: true,
    topmodule: Cookies.get('topmodule'),
    leftmodule: [],
    device: 'desktop',
    language: Cookies.get('language') || 'en',
    banner_logo: Cookies.get('banner_logo') || '',
    login_background: Cookies.get('login_background') || '',
    login_logo: Cookies.get('login_logo') || '',
    title: Cookies.get('title') || ''
  },
  mutations: {
    OPEN_LOGOPTION: (state, isLog) => {
      state.isLogOperation = isLog
    },
    OPEN_MODULE: (state, topmodule) => {
      Cookies.set('topmodule', topmodule)
      state.topmodule = topmodule
    },
    OPEN_LFETMODULE: (state, index) => {
      state.leftmodule.push(index)
    },
    CLOSE_LFETMODULE: (state, index) => {
      const currIndex = state.leftmodule.indexOf(index)
      if (currIndex > -1) {
        state.leftmodule.splice(currIndex, 1)
      }
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    },
    SET_BASE_INFO: (state, baseOption) => {
      const {banner_logo, login_background, login_logo, title} = baseOption
      state.banner_logo = banner_logo
      state.login_background = login_background
      state.login_logo = login_logo
      state.title = title
      Cookies.set('banner_logo', banner_logo)
      Cookies.set('login_background', login_background)
      Cookies.set('login_logo', login_logo)
      Cookies.set('title', title)
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    toggleModule({ commit }, topmodule) {
      commit('OPEN_MODULE', topmodule)
    },
    openLeftModule({ commit }, index) {
      commit('OPEN_LFETMODULE', index)
    },
    closeLeftModule({ commit }, index) {
      commit('CLOSE_LFETMODULE', index)
    },
    openLogOption({ commit }, isLog) {
      commit('OPEN_LOGOPTION', isLog)
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setBaseInfo({ commit }, baseOption) {
      commit('SET_BASE_INFO', baseOption)
    }
  }
}

export default app
