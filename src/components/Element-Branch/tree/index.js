import TreeBranch from './src/tree.vue'

/* istanbul ignore next */
TreeBranch.install = function(Vue) {
  Vue.component(TreeBranch.name, TreeBranch)
}

export default TreeBranch
