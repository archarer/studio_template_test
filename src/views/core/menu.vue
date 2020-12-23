<template>
  <div class="app-container">
    <top-menu>
    </top-menu>
    <div class="filter-container">
      <el-input placeholder="输入关键字进行过滤" v-model="filterMenuText"> </el-input>
    </div>
    <div class="data-container">
      <div class="block">
        <el-tree :data="treeData" node-key="id" ref="dataTree" :filter-node-method="filterMenuNode" :render-content="renderContent" @node-contextmenu="rowTreeContextmenu" draggable highlight-current @node-drag-end="handleDragTreeEnd" :allow-drop="allowTreeDrop" :allow-drag="allowTreeDrag" :default-expanded-keys="defaultExpanded">
        </el-tree>
      </div>
    </div>
    <div class="edit-container">
      <el-dialog :title="dialogEditTitle" :visible.sync="dialogEditVisible" width="600px">
        <el-container>
          <el-form :rules="formRules" ref="editForm" :model="rowData" size="mini" label-position="right" label-width="100px" style='width: 90%; margin-left:10px;'>
            <el-form-item label="菜单名" prop="menuName">
              <el-input v-model="rowData.menuName"></el-input>
            </el-form-item>
            <el-form-item label="菜单类型">
              <el-radio-group v-model="rowData.menuType">
                <el-radio label="1" v-if="isSysMenu">系统栏目</el-radio>
                <el-radio label="2" v-if="!isSysMenu">右侧栏目</el-radio>
                <el-radio label="3" v-if="!isSysMenu">操作按钮</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="按钮位置" v-show="rowData.menuType==3">
              <el-radio-group v-model="rowData.buttonPlace">
                <el-radio label="1">顶部</el-radio>
                <el-radio label="2">列表</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="图标" prop="menuIcon">
              <el-tag v-on:click.native="dialogIconVisible=true" v-show="rowData.menuIcon===''" style="cursor: pointer;">选择图标</el-tag>
              <i :class="'fa fa-'+rowData.menuIcon" v-show="rowData.menuIcon!==''" style="cursor: pointer;" @click="dialogIconVisible=true"></i>
            </el-form-item>
            <el-form-item label="是否显示" prop="isShow">
              <el-switch v-model="rowData.isShow" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="是否授权">
              <el-switch v-model="rowData.isPower" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item-branch label="接口地址" tipPosition="left" tipContent="服务端权限校验">
              <div v-for="(item,key) in rowData.apiPathData" :key="key">
                <el-input v-model="rowData.apiPathData[key]" style="width:352px;"></el-input>
                <el-button type="danger" @click="removeApiUrl(key)"><i class="fa fa-trash-o fa-lg"></i></el-button>
              </div>
              <el-button type="primary" @click="addApiUrl()">添加</el-button>
            </el-form-item-branch>
            <el-form-item label="视图地址">
              <el-input v-model="rowData.viewPath"></el-input>
            </el-form-item>
            <el-form-item label="栏目权限" v-show="rowData.menuType!=3">
              <el-select v-model="rowData.menuCoteID" filterable placeholder="请选择">
                <el-option v-for="item in menuCoteData" :key="item.MenuCoteID" :label="item.CoteTitle" :value="item.MenuCoteID">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="菜单颜色" v-show="rowData.menuType==3">
              <el-radio-group v-model="rowData.buttonColor">
                <el-radio-button label="">无</el-radio-button>
                <el-radio-button label="primary">蓝</el-radio-button>
                <el-radio-button label="success">绿</el-radio-button>
                <el-radio-button label="info">灰</el-radio-button>
                <el-radio-button label="warning">橙</el-radio-button>
                <el-radio-button label="danger">红</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="菜单事件" v-show="rowData.menuType==3">
              <el-input v-model="rowData.commandName"></el-input>
            </el-form-item>
            <el-form-item label="菜单事件参数" v-show="rowData.menuType==3">
              <el-input v-model="rowData.commandParms"></el-input>
            </el-form-item>
            <el-form-item label="菜单显示规则" v-show='rowData.buttonPlace==2'>
              <div v-for="item in rowData.showCondition" :key="item">
                <el-input v-model="item.FieldName" style="width:90px"></el-input>
                <el-switch v-model="item.FieldCal" active-value="not" inactive-value="in" active-text="not" inactive-text="in"></el-switch>
                <el-input v-model="item.FieldValue" style="width:90px"></el-input>
                <el-button type="text" @click.prevent="removeShowCondition(item)" style="width:50px">删除</el-button>
              </div>
              <el-button type="text" @click="handleAddShowCondition()">添加规则</el-button>
            </el-form-item>
            <el-form-item label="排序号">
              <el-input v-model="rowData.sortIndex" style="width:178px"></el-input>
            </el-form-item>
          </el-form>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hideEditDialog()">取消</el-button>
          <el-button type="primary" @click="saveTreeInfo()" :loading="saveLoading">提交</el-button>
        </div>
        <el-dialog title="选择图标" :visible.sync="dialogIconVisible" append-to-body width="400px">
          <FontAwesome></FontAwesome>
        </el-dialog>
      </el-dialog>
      <el-dialog title="快速选择菜单" :visible.sync="dialogFastMenuVisible" width="350px">
        <el-input v-model="suffixName"></el-input>
        <el-checkbox-group v-model="fastButtonType">
          <el-checkbox v-for="buttonType in buttonTypeData" :label="buttonType.buttonType" :key="buttonType.buttonType">{{buttonType.buttonName}}</el-checkbox>
        </el-checkbox-group>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFastMenuVisible=false">取消</el-button>
          <el-button type="primary" @click="saveFastMenu()" :loading="saveLoading">提交</el-button>
        </div>
      </el-dialog>
      <el-dialog title="信息位" :visible.sync="dialogPlaceVisible" width="350px">
        <el-input v-model="placeConfigName" placeholder="位置名称"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPlaceVisible=false">取消</el-button>
          <el-button type="primary" @click="savePlaceMenu()" :loading="saveLoading">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <air-contex-menu>
    </air-contex-menu>
  </div>
</template>
<script>
import request from '@/utils/request'
import FontAwesome from '@/components/FontAwesome-Icon'
export default {
  components: {
    FontAwesome
  },
  data() {
    return {
      pageDataUrl: window.Global.POWER_API + '/Power/MenuTree',
      saveUrl: window.Global.POWER_API + '/Power/SaveMenu',
      moveUrl: window.Global.POWER_API + '/Power/MoveMenu',
      deleteUrl: window.Global.POWER_API + '/Power/DeleteMenu',
      placeConfigName: '',
      filterMenuText: '',
      copyMenuID: '',
      dialogPlaceVisible: false,
      dialogIconVisible: false,
      dialogFastMenuVisible: false,
      menuCoteData: [],
      defaultExpanded: [],
      isSysMenu: false,
      suffixName: '',
      fastButtonType: [],
      rowData: {
        apiPathData: []
      },
      contentMenuList: [],
      buttonTypeData: [
        { buttonName: '新增', buttonType: 1 },
        { buttonName: '修改', buttonType: 2 },
        { buttonName: '删除', buttonType: 3 },
        { buttonName: '保存', buttonType: 4 },
        { buttonName: '返回', buttonType: 5 },
        { buttonName: '查询', buttonType: 6 },
        { buttonName: '详细', buttonType: 7 },
        { buttonName: '发布', buttonType: 8 },
        { buttonName: '取消发布', buttonType: 9 }
      ],
      formRules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { max: 50, message: '长度在 50 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.readTreeData()
    this.readMenuCoteData()
  },
  watch: {
    filterMenuText(val) {
      this.$refs.dataTree.filter(val)
    }
  },
  methods: {
    removeApiUrl(index) {
      this.rowData.apiPathData.splice(index, 1)
    },
    addApiUrl() {
      this.rowData.apiPathData.push('')
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
    beforeSaveInfo() {
      this.rowData.showConditionStr = JSON.stringify(this.rowData.showCondition)
      this.rowData.apiPath = this.rowData.apiPathData.toString()
    },
    readMenuCoteData() {
      request({
        url: window.Global.POWER_API + '/Power/GetMenuCoteSelect',
        method: 'get'
      }).then(response => {
        this.menuCoteData = response.data.Data
        this.menuCoteData.forEach(element => {
          element.MenuCoteID = element.MenuCoteID.toString()
        })
        this.menuCoteData.unshift({ MenuCoteID: '0', CoteTitle: '无' })
      })
    },
    syncSql(id) {
      location.href = window.Global.POWER_API + '/Power/SyncSql?menuID=' + id
    },
    insertSql(id) {
      location.href = window.Global.POWER_API + '/Power/InsertSql?menuID=' + id
    },
    updateSql(id) {
      location.href = window.Global.POWER_API + '/Power/UpdateSql?menuID=' + id
    },
    menuTypeTag(menuType) {
      switch (menuType) {
        case '1':
          return '系统菜单'
        case '2':
          return '栏目菜单'
        case '3':
          return '操作菜单'
      }
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class='custom-tree-node' >
          <div><i class={'fa fa-' + data.menuIcon}></i> {data.menuName}</div>
          <div>
            <el-tag type={data.menuType === '1' ? 'success' : data.menuType === '2' ? 'warning' : ''} style='margin-right: 10px;'>{this.menuTypeTag(data.menuType)}</el-tag>
            <el-tag type={data.isShow === 1 ? 'danger' : 'info'} style='margin-right: 10px;'>{data.isShow === 1 ? '显示' : '隐藏'}</el-tag>
          </div>
        </div>)
    },
    setRowData() {
      this.rowData = {
        id: '',
        menuName: '',
        menuIcon: '',
        parentID: '',
        menuType: '0',
        isShow: 1,
        isPower: 1,
        apiPath: '',
        viewPath: '',
        targetUrl: '',
        idPath: '',
        menuNamePath: '',
        commandName: '',
        commandParms: '',
        buttonPlace: '0',
        buttonColor: '',
        menuCoteKey: '',
        showCondition: [],
        apiPathData: [],
        showConditionStr: '',
        sortIndex: 0
      }
    },
    handleTopMenuCommand(commandName, commandParms) {
      console.log(commandParms)
      switch (commandName) {
        case 'create':
          this.setRowData()
          this.$nextTick(() => {
            this.$refs['editForm'].clearValidate()
          })
          this.dialogEditTitle = '添加菜单'
          this.rowData.parentID = commandParms
          this.isSysMenu = true
          this.showEditDialog()
          break
      }
    },
    handleContentMenuCommand(row, commandName, commandParms) {
      switch (commandName) {
        case 'create':
          var currParentID = this.rowData.id
          this.setRowData()
          this.$nextTick(() => {
            this.$refs['editForm'].clearValidate()
          })
          this.dialogEditTitle = '添加菜单'
          this.isSysMenu = false
          this.rowData.parentID = currParentID
          this.showEditDialog()
          break
        case 'edit':
          if (row.parentID === '') {
            this.isSysMenu = true
          } else {
            this.isSysMenu = false
          }
          this.dialogEditTitle = '修改菜单'
          this.handleEdit(row)
          break
        case 'fastmenu':
          this.dialogFastMenuVisible = true
          this.fastButtonType = []
          this.suffixName = ''
          this.rowData = Object.assign({}, row)
          break
        case 'place':
          this.dialogPlaceVisible = true
          this.placeConfigName = ''
          this.rowData = Object.assign({}, row)
          break
        case 'copy':
          this.copyMenuID = row.id
          break
        case 'stick':
          this.rowData = Object.assign({}, row)
          this.saveCopyMenu()
          break
        case 'delete':
          this.handleTreeDelete(this.$refs.dataTree.getNode(this.rowData.id), row)
          break
        case 'sync':
          this.syncSql(this.rowData.id)
          break
        case 'insert':
          this.insertSql(this.rowData.id)
          break
        case 'update':
          this.updateSql(this.rowData.id)
          break
      }
    },
    saveCopyMenu: function() {
      request({
        url: window.Global.POWER_API + '/Power/SaveCopyMenu',
        method: 'get',
        params: { copyMenuID: this.copyMenuID, stickMenuID: this.rowData.id }
      }).then(response => {
        if (response.data.ResultCode !== '0') {
          this.$message.error(response.data.ResultMessage)
        } else {
          this.$message({
            message: '复制成功',
            type: 'success'
          })
          this.treeData = []
          this.readTreeData()
          this.defaultExpanded = []
          this.defaultExpanded.push(this.rowData.id)
          this.copyMenuID = ''
        }
      })
    },
    saveFastMenu: function() {
      request({
        url: window.Global.POWER_API + '/Power/SaveFastMenu',
        method: 'get',
        params: { parentID: this.rowData.id, suffixName: this.suffixName, buttonTypeStr: this.fastButtonType.toString() }
      }).then(response => {
        if (response.data.ResultCode !== '0') {
          this.$message.error(response.data.ResultMessage)
        } else {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.dialogFastMenuVisible = false
          this.treeData = []
          this.readTreeData()
          this.defaultExpanded = []
          this.defaultExpanded.push(this.rowData.id)
        }
      })
    },
    savePlaceMenu: function() {
      request({
        url: '/PlaceInfo/AddPlaceInfoMenu',
        method: 'get',
        params: { parentID: this.rowData.id, placeConfigName: this.placeConfigName }
      }).then(response => {
        if (response.data.ResultCode !== '0') {
          this.$message.error(response.data.ResultMessage)
        } else {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.dialogPlaceVisible = false
          this.treeData = []
          this.readTreeData()
          this.defaultExpanded = []
          this.defaultExpanded.push(this.rowData.id)
        }
      })
    },
    filterMenuNode(value, data) {
      if (!value) return true
      return data.menuNamePath.indexOf(value) !== -1
    },
    selectMenuIcon(icon) {
      this.rowData.menuIcon = icon
      this.dialogIconVisible = false
    },
    handleAddShowCondition() {
      this.rowData.showCondition.push({
        FieldName: '',
        FieldCal: '',
        FieldValue: ''
      })
    },
    removeShowCondition(item) {
      var index = this.rowData.showCondition.indexOf(item)
      if (index !== -1) {
        this.rowData.showCondition.splice(index, 1)
      }
    },
    rowTreeContextmenu(event, row, node) {
      this.contentMenuList = [
        {
          name: '快速',
          title: '快速',
          icon: 'fa fa-coffee',
          commandName: 'fastmenu',
          showCondition: ''
        },
        {
          name: '添加',
          title: '添加',
          icon: 'fa fa-plus-circle',
          commandName: 'create',
          showCondition: ''
        },
        {
          name: '编辑',
          title: '编辑',
          icon: 'fa fa-edit',
          commandName: 'edit',
          showCondition: ''
        },
        {
          name: '删除',
          title: '删除',
          icon: 'fa fa-remove',
          commandName: 'delete',
          showCondition: ''
        },
        {
          name: '导出同步脚本',
          title: '导出同步脚本',
          icon: 'fa fa-comment-o',
          commandName: 'sync',
          showCondition: ''
        },
        {
          name: '导出新增脚本',
          title: '导出新增脚本',
          icon: 'fa fa-comment-o',
          commandName: 'insert',
          showCondition: ''
        },
        {
          name: '导出更新脚本',
          title: '导出更新脚本',
          icon: 'fa fa-comment-o',
          commandName: 'update',
          showCondition: ''
        }
      ]

      if (this.copyMenuID !== row.id && row.menuType !== '1') {
        this.contentMenuList.push(
          {
            name: '复制',
            title: '复制',
            icon: 'fa fa-copy',
            commandName: 'copy',
            showCondition: ''
          }
        )
      }
      if (this.copyMenuID !== '') {
        this.contentMenuList.push(
          {
            name: '粘贴',
            title: '粘贴',
            icon: 'fa fa-sticky-note',
            commandName: 'stick',
            showCondition: ''
          }
        )
      }
      this.rowData = row
      this.contentPosition.left = event.clientX
      this.contentPosition.top = event.clientY
      this.contentMenuVisible = true
      this.$refs.dataTree.setCurrentNode(node)

      event.returnValue = false
    }
  }
}
</script>