<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu-branch
      ref="elMenu"
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in permission_routers" :key="route.name" :item="route" :base-path="route.path" ></sidebar-item>
      <li  class="el-menu-item" style="padding-left: 20px; color: rgb(191, 203, 217); cursor: default;background-color: rgb(48, 65, 86);"></li>
    </el-menu-branch>
    <div></div>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    console.log(this.permission_routers)
  }
}
</script> 
<style rel="stylesheet/scss" lang="scss" scoped>
.sidebar-container
{
  margin-top: 55px;
}
</style>

