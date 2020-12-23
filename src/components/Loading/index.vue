<template>
  <div ref="loader" id="loader" class="loader">
    <div class='wrapper'>
      <div></div>
    </div>
    <div class='wrapper'>
      <div></div>
    </div>
    <div class='wrapper'>
      <div></div>
    </div>
    <div class='wrapper'>
      <div></div>
    </div>
    <div class='wrapper'>
      <div></div>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request'
  export default {
    name: 'loading'
  }
</script>
<style lang="scss">
  @import '../../styles/loading.scss';
</style>