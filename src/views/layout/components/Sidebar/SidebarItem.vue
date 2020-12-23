<template>
  <div v-if="!item.hidden&&item.children&&topModuleName==item.meta.groupID"  class="menu-wrapper">
      <router-link v-if="hasChild(item)" :to="resolvePath(item.children[0].path)">
        <el-menu-item :index="resolvePath(item.children[0].path)" class="submenu-title-noDropdown" :group="item.meta.groupID" >
          <i v-if="item.meta.icon" :class="'fa fa-'+item.meta.icon"></i>
          <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
        </el-menu-item>
      </router-link>
      <el-submenu v-else :index="item.name||item.path" :group="item.meta.groupID">
        <template slot="title">
          <i v-if="item.meta.icon" :class="'fa fa-'+item.meta.icon"></i>
          <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
        </template>
        <template>
          <el-collapse-transition >
            <div v-if="leftModule.indexOf(item.name)>-1">
              <template  v-for="child in item.children.filter(ele=>{return !ele.hidden})">
                <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :item="child" :key="child.path ? child.path : child.meta.title"  :base-path="resolvePath(child.path)"></sidebar-item>
                <router-link v-else :to="resolvePath(child.path)" :key="child.name">
                  <el-menu-item :index="resolvePath(child.path)">
                    <i  v-if="item.meta.icon" :class="'fa fa-'+child.meta.icon"></i>
                    <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
                  </el-menu-item>
                </router-link>
              </template>
            </div>
          </el-collapse-transition>
        </template>
      </el-submenu>
  </div>
</template>

<script>
import path from 'path'
export default {
  name: 'SidebarItem',
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  computed: {
    topModuleName() {
      return this.$store.state.app.topmodule
    },
    leftModule() {
      return this.$store.state.app.leftmodule
    }
  },
  data() {
    return {
      onlyOneChild: null
    }
  },
  methods: {
    hasChild(item) {
      var currChild = []
      if (item.children) {
        currChild = item.children.filter(ele => { return !ele.hidden })
      }
      if (currChild.length === 0) {
        return true
      }
      return false
    },
    resolvePath(...paths) {
      return path.resolve(this.basePath, ...paths)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
.sidebar-hidden
{
  display: none;
}

#app .sidebar-container .fa{
 margin-right: 15px;
  }
</style>

