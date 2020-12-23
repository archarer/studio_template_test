<template>
  <section class="app-main"  v-loading="watchDataLoading" 
        element-loading-text="数据加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(48, 65, 86, 0.63)">
        <el-scrollbar style="height:100%">
     <transition name="fade-transform" mode="out-in">
        <router-view :key="key" v-on:listenChildEvent="handleLoadingStatus" size="mini"></router-view>
    </transition>
    </el-scrollbar>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      isDataLoading: false
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    },
    watchDataLoading() {
      return this.isDataLoading
    }
  },
  created() {
    this.$ELEMENT.size = 'mini'
  },
  methods: {
    handleLoadingStatus(status) {
      this.isDataLoading = status
    }
  }
}
</script>

<style scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  height: calc(100vh - 84px);
  position: relative;
  overflow: hidden;
}
</style>

