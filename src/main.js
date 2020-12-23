import Vue from 'vue'

import './permission'
import 'font-awesome/css/font-awesome.css'
import 'normalize.css/normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'

import JsonViewer from 'vue-json-viewer'
import VueParticles from 'vue-particles'
import Element from 'element-ui'
import Loading from 'element-ui'
import contentPorcess from '@/utils/contentProcess'
import App from './App'
import router from './router'
import store from './store'
import qs from 'qs'
import ElFormItemBranch from '@/components/Element-Branch/form-item'
import ElMenuBranch from '@/components/Element-Branch/menu'
import ElUploadBranch from '@/components/Element-Branch/upload'

import EleMultiCascader from 'ele-multi-cascader'
import 'ele-multi-cascader/dist/cascader.css'

Vue.prototype.$qs = qs
Vue.prototype.$loading = Loading

Vue.use(Element, {
  size: 'medium'
})

Vue.config.productionTip = false
Vue.mixin(contentPorcess)
Vue.use(ElFormItemBranch)
Vue.use(ElMenuBranch)
Vue.use(ElUploadBranch)
Vue.use(VueParticles)
Vue.use(JsonViewer)
Vue.use(EleMultiCascader)

new Vue({
  el: '#app',
  router,
  store,
  Loading,
  render: h => h(App)
})
