<template>
  <div class="app-container">
    <top-menu>
    </top-menu>
    <div class="filter-container">
      <el-input size="small" style="width: 200px;" clearable class="filter-item" :placeholder="'产品名称'" v-model="readOptions.ProductName.Value">
      </el-input>
    </div>
    <el-table :data="tableDataInfo.Data" row-key="ChannelID" ref="DataTable" highlight-current-row @select-all="selectAllRow" @sort-change="handleSort" @row-contextmenu="rowContextmenu" border fit style="width: 100%;">
      <el-table-column type="selection" width="40">
      </el-table-column>
      <el-table-column width="100" align="center" label="产品ID">
        <template slot-scope="scope">
          <span>{{scope.row.ProductID}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="对外名称">
        <template slot-scope="scope">
          <span>{{scope.row.ProductName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="对内名称">
        <template slot-scope="scope">
          <span>{{scope.row.ProductSubName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="300" align="center" label="网页地址">
        <template slot-scope="scope">
          <span>{{scope.row.ManageUrl}}</span>
        </template>
      </el-table-column>
      <el-table-column width="300" align="center" label="权限地址">
        <template slot-scope="scope">
          <span>{{scope.row.PowerUrl}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="超管">
        <template slot-scope="scope">
          <span>{{scope.row.UserName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="新页面打开">
        <template slot-scope="scope">
          <span :class="{'red':scope.row.IsBrank === 0 }">{{scope.row.IsBrank===1?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="是否发布">
        <template slot-scope="scope">
          <span :class="{'red':scope.row.IsRelease === 0 }">{{scope.row.IsRelease===1?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="330" v-if="device === 'mobile'&&contentMenuList.length>0" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-for="item in contentMenuList" size="small" :key="item.name" class="filter-item" :type="item.color" v-show="contentMenuFilter(scope.row,item.showCondition)" :icon="'fa fa-'+item.icon" @click="handleContentMenuCommand(scope.row, item.commandName, item.commandParms)">{{item.name}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :hide-on-single-page="false" background @size-change="pageSizeChange" @current-change="pageIndexChange" :current-page="tableDataInfo.PageIndex+1" :page-sizes="[10,20,30, 50]" :page-size="tableDataInfo.PageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableDataInfo.RecordCount">
      </el-pagination>
    </div>
    <el-dialog :title="dialogEditTitle" :visible.sync="dialogEditVisible">
      <el-form :rules="rules" ref="editForm" :model="rowData" label-width="180px" style='width:95%;margin-left:10px;'>
        <el-form-item label="是否发布">
          <el-switch v-model="rowData.IsRelease" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="新页面打开">
          <el-switch v-model="rowData.IsBrank" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="对外名称" prop="ProductName">
          <el-input v-model="rowData.ProductName"></el-input>
        </el-form-item>
        <el-form-item label="对内名称" prop="ProductSubName">
          <el-input v-model="rowData.ProductSubName"></el-input>
        </el-form-item>
        <el-form-item label="业务地址">
          <el-input v-model="rowData.ManageUrl"></el-input>
        </el-form-item>
        <el-form-item label="权限地址">
          <el-input v-model="rowData.PowerUrl"></el-input>
        </el-form-item>
        <el-form-item label="图片地址">
          <el-upload-branch class="avatar-uploader" resourceCode="BaseResources" restrictCode="Pic" v-model="rowData.ImageUrl" uploadType="img" :show-file-list="false">
          </el-upload-branch>
        </el-form-item>
        <el-form-item label="超管ID">
          <el-tag type="primary" v-if="rowData.SuperID===''" @click.native="dialogSelectUserVisible=true">选择超管</el-tag>
          <el-tag type="primary" v-if="rowData.SuperID!==''" @click.native="dialogSelectUserVisible=true">{{rowData.UserName}}</el-tag>
        </el-form-item>
        <el-form-item label="FileContextKey" prop="FileContextKey">
          <el-input v-model="rowData.FileContextKey"></el-input>
        </el-form-item>
        <el-form-item label="LogContextKey" prop="LogContextKey">
          <el-input v-model="rowData.LogContextKey"></el-input>
        </el-form-item>
        <el-form-item label="PlugWorkContextKey" prop="PlugWorkContextKey">
          <el-input v-model="rowData.PlugWorkContextKey"></el-input>
        </el-form-item>
        <el-form-item label="ManageContextKey" prop="ManageContextKey">
          <el-input v-model="rowData.ManageContextKey"></el-input>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="rowData.Summary" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideEditDialog()">返回</el-button>
        <el-button type="primary" @click="saveInfo()" :loading="saveLoading">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择用户" :visible.sync="dialogSelectUserVisible">
      <selectUser></selectUser>
    </el-dialog>
    <air-contex-menu>
    </air-contex-menu>
  </div>
</template>

<script>
import selectUser from './selectUser.vue'
export default {
  components: {
    selectUser
  },
  data() {
    return {
      pageDataUrl: window.Global.POWER_API + '/Power/GetProductList',
      saveUrl: window.Global.POWER_API + '/Power/SaveProduct',
      deleteUrl: window.Global.POWER_API + '/Power/DeleteProduct',
      tableKeyName: 'ProductID',
      dialogSelectUserVisible: false,
      options: [],
      rules: {
        ProductName: [
          { required: true, message: '请输入对外名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        ProductSubName: [
          { required: true, message: '请输入对内名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        PlugWorkContextKey: [
          { required: true, message: '请输入链接字符串名', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        FileContextKey: [
          { required: true, message: '请输入链接字符串名', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        LogContextKey: [
          { required: true, message: '请输入链接字符串名', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        ManageContextKey: [
          { required: true, message: '请输入链接字符串名', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getContentMenu()
    this.readData()
  },
  methods: {
    handleSelectUser(user) {
      this.rowData.SuperID = user.UserID
      this.rowData.UserName = user.UserName
      this.dialogSelectUserVisible = false
    },
    initReadOptions() {
      this.readOptions = {
        PageIndex: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.Int, 0),
        PageSize: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.Int, 20),
        ProductID: this.setQueryValue(this.queryMethod.Contains, this.queryDataType.Int, ''),
        ProductName: this.setQueryValue(this.queryMethod.Contains, this.queryDataType.String, ''),
        // ProductSubName: this.setQueryValue(this.queryMethod.Contains, this.queryDataType.String, '')
      }
    },
    setRowData() {
      this.rowData = {
        ProductID: 0,
        ProductName: '',
        ProductSubName: '',
        ManageUrl: '',
        PowerUrl: '',
        Summary: '',
        ImageUrl: '',
        SuperID: '',
        PlugWorkContextKey: '',
        FileContextKey: '',
        LogContextKey: '',
        ManageContextKey: '',
        IsRelease: 0,
        IsBrank: 0
      }
    },
    handleTopMenuCommand(commandName, commandParms) {
      switch (commandName) {
        case 'search':
          this.handleSearch()
          break
        case 'create':
          this.dialogEditTitle = '产品渠道信息'
          this.handleCreate()
          break
      }
    },
    handleContentMenuCommand(row, commandName, commandParms) {
      switch (commandName) {
        case 'edit':
          this.dialogEditTitle = '产品渠道信息'
          this.handleEdit(row)
          break
        case 'delete':
          this.handleDelete(row)
          break
        case 'CreatePartTableFun':
          this.CreatePartTableFun(row)
          break
      }
    },
    // handleQueryChange() {
    //   this.readOptions.ProductSubName = this.readOptions.ProductName
    // }
  }
}
</script>