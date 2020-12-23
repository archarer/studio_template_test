<template>
  <div class="app-container">
    <div class="data-container">
      <el-container>
        <el-aside width="300px">
          <el-header class="treeHead" @click.native="showDetail({})">
            <div style="text-align: center;">菜单列表</div>
          </el-header>
          <el-main>
            <el-tree :data="treeData" node-key="id" ref="dataTree" :filter-node-method="filterMenuNode" :render-content="renderContent" highlight-current @node-click="showDetail" :expand-on-click-node="false">
            </el-tree>
          </el-main>
        </el-aside>
        <el-container>
          <el-main class="viewInfo" style="padding-top: 0;" v-if="viewData.id">
            <el-tag type="info" size="large">菜单名称:<b>{{viewData.menuName}}</b></el-tag>
            <fieldset style="border-color: #ecf5ff;margin-top:10px;" v-for="(item,index) in menuPowerData" :key="index">
              <legend style="color: #909399;">{{item.RoleName}} <i class="el-icon-delete" style='cursor: pointer;' @click="handleRemoveRole(item)"></i></legend>
              <div v-if="item.Summary" style="margin: 5px 0px 5px 0px;">
                <el-tag type="warning">{{item.Summary}}</el-tag>
              </div>
              <el-tag style="margin-right:10px;" v-for="(user,uindex) in item.UserInfoList" :key="uindex" @close="handleRemoveRoleUser(item,user)" closable>
                {{user.UserName===''?user.Account:user.UserName}}
              </el-tag>
            </fieldset>
          </el-main>
          <el-main v-else>
            <candle tipContent="请选择左侧栏目"></candle>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request'
import candle from '@/components/Css3-Animation/candle.vue'
export default {
  components: { candle },
  data() {
    return {
      pageDataUrl: window.Global.POWER_API + '/Power/MenuTree',
      viewData: {},
      menuPowerData: [],
      treeRootID: 1,
      treeData: []
    }
  },
  created() {
    this.readTreeData()
  },
  methods: {
    handleRemoveRole(role) {
      this.$confirm('确认删除该角色？').then(_ => {
        request({
          url: window.Global.POWER_API + '/Power/DeleteRole',
          method: 'get',
          params: { roleID: role.RoleID }
        }).then(response => {
          if (response.data.ResultCode === '0') {
            this.menuPowerData.splice(this.menuPowerData.indexOf(role), 1)
            this.$message.success('移除角色成功')
          } else {
            this.$message.error('移除失败，请联系管理员')
          }
        })
      })
    },
    handleRemoveRoleUser(role, user) {
      this.$confirm('确认删除该角色下的用户？').then(_ => {
        request({
          url: window.Global.POWER_API + '/Power/RemoveRoleUser',
          method: 'get',
          params: { roleID: role.RoleID, userID: user.UserID }
        }).then(response => {
          if (response.data.ResultCode === '0') {
            role.UserInfoList.splice(role.UserInfoList.indexOf(user), 1)
            this.$message.success('移除角色用户成功')
          } else {
            this.$message.error('移除失败，请联系管理员')
          }
        })
      })
    },
    readMenuPowerInfo() {
      request({
        url: window.Global.POWER_API + '/Power/MenuPowerInfo',
        method: 'get',
        params: { menuID: this.viewData.id }
      }).then(response => {
        if (response.data.ResultCode === '0') {
          this.menuPowerData = response.data.Data
        } else {
          this.$message.error('获取菜单权限失败')
        }
      })
    },
    toDataInfo(currData) {
      return {
        id: currData.MenuID,
        menuName: currData.MenuName,
        menuIcon: currData.MenuIcon,
        parentID: currData.ParentID,
        menuType: currData.MenuType.toString(),
        isShow: currData.IsShow,
        isPower: currData.IsPower,
        apiPath: currData.ApiPath,
        apiPathData: currData.ApiPath.split(','),
        viewPath: currData.ViewPath,
        targetUrl: currData.TargetUrl,
        idPath: currData.IDPath,
        menuNamePath: currData.MenuNamePath,
        menuCoteKey: currData.MenuCoteKey,
        commandName: currData.CommandName,
        commandParms: currData.CommandParms,
        sortIndex: currData.SortIndex,
        buttonPlace: currData.ButtonPlace.toString(),
        showCondition: currData.ShowCondition !== '' ? JSON.parse(currData.ShowCondition) : [],
        buttonColor: currData.ButtonColor,
        menuCoteID: currData.MenuCoteID.toString(),
        children: []
      }
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class='custom-tree-node' >
          <div><i class={'fa fa-' + data.menuIcon}></i> {data.menuName}</div>
        </div>)
    },
    handleTopMenuCommand(commandName, commandParms) {
      switch (commandName) {
        case 'delete':
          this.handleTreeDelete(this.$refs.dataTree.getNode(this.viewData.id), this.viewData)
          break
      }
    },
    showDetail(row) {
      this.viewData = row
      this.readMenuPowerInfo()
    }
  }
}
</script>