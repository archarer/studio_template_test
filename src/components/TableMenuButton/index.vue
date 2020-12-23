<template>
  <div class="table-menu-botton">
    <el-button
      v-for="item in menuList.slice(0,max)"
      size="small"
      :key="item.name"
      class="filter-item"
      :type="item.color"
      v-show="menuFilter(row,item.showCondition)"
      :icon="'fa fa-'+item.icon"
      @click="contentMenuCommand(row, item.commandName, item.commandParms)"
    >{{item.name}}</el-button>
    <el-dropdown class="avatar-container right-menu-item" trigger="click">
      <div class="avatar-wrapper">
        <el-button type="primary" size="small" v-if="menuList.length>max">
          <i class="fa fa-hand-o-down" aria-hidden="true"></i>更多
        </el-button>
        <i class="el-icon-caret-bottom" style="color:#ffffff;"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :divided="index>0" v-for="(item,index) in menuList.slice(max,menuList.length)" :key="item.name"      v-show="menuFilter(row,item.showCondition)"  @click.native="contentMenuCommand(row, item.commandName, item.commandParms)">
          <span class="table-menu-item">{{item.name}}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>


<script>
export default {
  name: 'tableMenuButton',
  props: {
    max: {
      type: Number,
      default: function() {
        return 2
      }
    },
    row: {
      type: Object | Array,
      default: function() {
        return {}
      }
    },
    menuList: {
      type: Array,
      default: function() {
        return []
      }
    },
    menuFilter: Function,
    contentMenuCommand: Function
  }
}
</script>
<style>
.table-menu-item{
  line-height: 30px;
}
</style>

