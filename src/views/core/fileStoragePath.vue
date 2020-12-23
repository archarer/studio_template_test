<template>
  <div class="app-container">
    <top-menu>
    </top-menu>
    <div class="filter-container">
    </div>
    <el-table :data="tableDataInfo.Data" row-key="FileStoragePathID" ref="DataTable" highlight-current-row @select-all="selectAllRow" @sort-change="handleSort" @row-contextmenu="rowContextmenu" border fit style="width: 100%;">
      <el-table-column type="selection" width="40">
      </el-table-column>
      <el-table-column align="center" label="存储名称">
        <template slot-scope="scope">
          <span>{{scope.row.StoragePathName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="存储类型">
        <template slot-scope="scope">
          <span>{{getStorageTypeName(scope.row.StorageTypeID)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="虚目录">
        <template slot-scope="scope">
          <span>{{scope.row.VirtualName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="存储地址">
        <template slot-scope="scope">
          <span>{{scope.row.StoragePath}}</span>
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
      <el-form :rules="rules" ref="editForm" :model="rowData" label-width="120px" style='width:95%;margin-left:10px;'>
        <el-form-item label="存储名称" prop="StoragePathName">
          <el-input v-model="rowData.StoragePathName"></el-input>
        </el-form-item>
        <el-form-item label="存储类型" prop="StorageTypeID">
          <el-select v-model="rowData.StorageTypeID" placeholder="请选择">
            <el-option v-for="item in storageTypeData" :key="item.StorageTypeID" :label="item.StorageTypeName" :value="item.StorageTypeID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="rowData.StorageTypeID===1000?'程序集名称':'虚拟目录'" v-if="rowData.StorageTypeID!==4">
          <el-input v-model="rowData.VirtualName"></el-input>
        </el-form-item>
        <el-form-item :label="rowData.StorageTypeID===3?'文件组名':rowData.StorageTypeID===1000?'完整类型名称':'存储地址'" v-if="rowData.StorageTypeID!==4">
          <el-input v-model="rowData.StoragePath"></el-input>
        </el-form-item>
        <el-form-item label="IP" v-if="rowData.StorageTypeID===2">
          <el-input v-model="rowData.IPAddress"></el-input>
        </el-form-item>
        <el-form-item label="帐号" v-if="rowData.StorageTypeID===2">
          <el-input v-model="rowData.Account"></el-input>
        </el-form-item>
        <el-form-item label="密码" v-if="rowData.StorageTypeID===2">
          <el-input v-model="rowData.Password"></el-input>
        </el-form-item>
        <el-form-item label="端口" v-if="rowData.StorageTypeID===2">
          <el-input v-model="rowData.Port"></el-input>
        </el-form-item>
        <el-form-item label="配置文件" v-if="rowData.StorageTypeID===3||rowData.StorageTypeID===4||rowData.StorageTypeID===1000">
          <el-input v-model="rowData.StorageConfig" :rows="10" type="textarea"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideEditDialog()">取消</el-button>
        <el-button type="primary" @click="saveInfo()" :loading="saveLoading">提交</el-button>
      </div>
    </el-dialog>

    <air-contex-menu>
    </air-contex-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageDataUrl: window.Global.POWER_API + '/File/GetStoragePathList',
      saveUrl: window.Global.POWER_API + '/File/SaveStoragePath',
      deleteUrl: window.Global.POWER_API + '/File/DeleteStoragePath',
      tableKeyName: 'FileStoragePathID',
      storageTypeData: [
        { StorageTypeID: 1, StorageTypeName: '本地存储' },
        { StorageTypeID: 2, StorageTypeName: 'FTP' },
        { StorageTypeID: 3, StorageTypeName: '文件系统' },
        { StorageTypeID: 4, StorageTypeName: '腾讯云' },
        { StorageTypeID: 1000, StorageTypeName: '反射存储' }
      ],
      rules: {
        StoragePathName: [
          { required: true, message: '存储名称不能为空' },
          { type: 'string', message: '存储名称必须为数字值' }
        ],
        StorageTypeID: [
          { required: true, message: '存储类型1本地存储2FTP3文件系统不能为空' },
          { type: 'number', message: '存储类型1本地存储2FTP3文件系统必须为数字' }
        ]
      }
    }
  },
  created() {
    this.getContentMenu()
    this.readData()
  },
  methods: {
    initReadOptions() {
      this.readOptions = {
        PageIndex: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.Int, 0),
        PageSize: this.setQueryValue(this.queryMethod.Equal, this.queryDataType.Int, 10)
      }
    },
    getStorageTypeName(storageTypeID) {
      var currStorageItem = this.storageTypeData.find((item) => {
        return item.StorageTypeID === storageTypeID
      })
      if (currStorageItem) {
        return currStorageItem.StorageTypeName
      }
    },
    setRowData() {
      this.rowData = {
        FileStoragePathID: '',
        StoragePathName: '',
        StorageTypeID: '',
        VirtualName: '',
        StoragePath: '',
        IPAddress: '',
        Account: '',
        Password: '',
        Port: '',
        StorageConfig: ''
      }
    },
    handleTopMenuCommand(commandName, commandParms) {
      switch (commandName) {
        case 'search':
          this.handleSearch()
          break
        case 'create':
          this.dialogEditTitle = '添加数据'
          this.handleCreate()
          break
      }
    },
    handleContentMenuCommand(row, commandName, commandParms) {
      switch (commandName) {
        case 'edit':
          this.dialogEditTitle = '修改数据'
          this.handleEdit(row)
          break
        case 'delete':
          this.handleDelete(row)
          break
        case 'copy':
          this.dialogEditTitle = '添加数据'
          this.handleCreate()
          this.rowData = Object.assign({}, row)
          this.rowData.FileStoragePathID = ''
          this.rowData.StoragePathName = this.rowData.StoragePathName + '==复制'
          break
      }
    }
  }
}
</script>
