<template>
  <div id="app">
    <section class="orientation"><p>请将横屏显示好么？</p></section>
    <router-view></router-view>
    <loading></loading>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
export default{
  name: 'App',
  components: {
    Loading
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" >
 @import "src/styles/content.scss"
</style>