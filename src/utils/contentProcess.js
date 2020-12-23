
import store from '@/store'
import request from '@/utils/request'
import airContexMenu from '@/utils/contextMenu.js'
import waves from '@/directive/waves'
import TopMenu from '@/views/layout/components/TopMenu'
import Sortable from 'sortablejs'
import clip from '@/utils/clipboard'
export const contentProcess = {
  directives: {
    waves
  },
  components: {
    airContexMenu,
    TopMenu
  },
  data() {
    return {
      queryMethod: {
        Equal: 'Equal',
        GreaterThan: 'GreaterThan',
        GreaterThanOrEqual: 'GreaterThanOrEqual',
        LessThan: 'LessThan',
        LessThanOrEqual: 'LessThanOrEqual',
        NotEqual: 'NotEqual',
        StartsWith: 'StartsWith',
        EndsWith: 'EndsWith',
        Contains: 'Contains',
        Like: 'Like',
        StdIn: 'StdIn',
        In: 'In'
      },
      queryDataType: {
        String: 'String',
        Int: 'Int',
        Date: 'Date'
      },
      querySortType: {
        Desc: 'Desc',
        Asc: 'Asc'
      },
      contentPosition: {
        left: 0,
        top: 0
      },
      logOperationType: {
        Insert: 1,
        Update: 2,
        Delete: 3,
        Release: 4,
        UnRelease: 5,
        Audit: 6,
        UnAudit: 7,
        Vouch: 8,
        UnVouch: 9,
        Top: 10,
        CancelTop: 11,
        MoveRow: 12,
        Other: 1000
      },
      tableKeyName: '',
      tableDataInfo: [],
      rowData: {},
      viewData: {},
      treeData: [],
      contentMenuList: [],
      readOptions: {},
      dialogEditTitle: '',
      contentMenuVisible: false,
      saveLoading: false,
      dialogEditVisible: false,
      setSort: false,
      isLogOperate: true,
      logParms: '',
      columnSort: '',
      treeRootID: '',
      listLoading: false,
      pageCoteID: 0,
      manageProductID: 0,
    }
  },
  computed: {
    device() {
      return this.$store.state.app.device
    },
    selectRowID() {
      return this.$route.query.selectRowID
    }
  },
  created() {
    if (this.initReadOptions) {
      this.initReadOptions()
    }
    this.getPageCoteID()
  },
  methods: {
    beforeLoadPage() {
      this.listLoading = true
      this.$emit('listenChildEvent', true)
      store.dispatch('openLogOption', this.isLogOperate)
    },
    afterLoadPage() {
      this.$emit('listenChildEvent', false)
    },
    selectAllRow(selector) {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      var rows = el.children
      for (var i = 0; i < rows.length; i++) {
        rows[i].classList[selector.length === 0 ? 'remove' : 'add']('current-row')
      }
    },
    setQueryValue(method, dataType, value) {
      return {
        QueryType: 'Query',
        QueryDataType: dataType,
        QueryMethod: method,
        Value: value
      }
    },
    setQuerySortValue(value) {
      return {
        QueryType: 'Sort',
        Value: value
      }
    },
    getReadOptions(readOptions) {
      var currReadOptions = {}
      for (var option in readOptions) {
        currReadOptions[option] = JSON.stringify(readOptions[option])
      }
      return currReadOptions
    },
    getContentMenu() {
      const routeName = this.$route.name
      const currContentMenu = []
      const currDataList = store.getters.addRouters
      for (var i = 0; i < currDataList.length; i++) {
        if (currDataList[i].name.split(':')[0] === routeName.split(':')[0]) {
          if (currDataList[i].buttons && currDataList[i].buttons.length > 0) {
            currDataList[i].buttons.forEach(element => {
              if (element.buttonplace === 2) {
                currContentMenu.push(element)
              }
            })
          }
        } else {
          if (currDataList[i].children) {
            this.getChildContentMenu(currContentMenu, routeName, currDataList[i].children)
          }
        }
      }
      this.contentMenuList = this.toContentMenuData(currContentMenu)
    },
    contentMenuFilter(row, showCondition) {
      var isShow = false
      if (showCondition !== '') {
        var fields = JSON.parse(showCondition)
        if (fields.length === 0) {
          return true
        }
        for (var i = 0; i < fields.length; i++) {
          var field = fields[i]
          if (field.FieldCal === 'in') {
            if (row[field.FieldName] === '') {
              isShow = false
            } else {
              isShow = field.FieldValue.indexOf(row[field.FieldName]) > -1
            }
          } else {
            if (row[field.FieldName] === '') {
              isShow = true
            } else {
              isShow = !(field.FieldValue.indexOf(row[field.FieldName]) > -1)
            }
          }
          if (!isShow) {
            break
          }
        }
      } else {
        isShow = true
      }
      return isShow
    },
    readData() {
      this.beforeLoadPage()
      if (this.beforeReadData) {
        this.beforeReadData()
      }
      const postData = this.$qs.stringify(this.getReadOptions(this.readOptions))
      request({
        url: this.pageDataUrl,
        method: 'post',
        manageProductID: this.manageProductID,
        data: postData
      }).then(response => {
        if (response.data.ResultCode === '0') {
          if (response.data.Data.Data === null) {
            this.tableDataInfo.Data = []
          } else {
            this.tableDataInfo = response.data.Data
          }
          this.listLoading = false
        } else {
          this.$message.error(response.data.ResultMessage)
        }
        if (this.toDataInfo) {
          this.tableDataInfo.Data.forEach(element => {
            this.toDataInfo(element)
          })
        }
        if (this.setSort) {
          this.$nextTick(() => {
            this.setSortTable()
          })
        }
        if (this.afterReadData) {
          this.afterReadData()
        }
        this.afterLoadPage()
      })
    },
    readTreeData() {
      this.beforeLoadPage()
      if (this.beforeReadData) {
        this.beforeReadData()
      }
      request({
        url: this.pageDataUrl,
        method: 'get',
        manageProductID: this.manageProductID
      }).then(response => {
        var currTreeData = response.data.Data
        for (var i = 0; i < currTreeData.length; i++) {
          var currTreeDataItem = currTreeData[i]
          var currTreeNode = this.toDataInfo(currTreeDataItem)
          if (currTreeDataItem.ChildList) {
            this.getChildTreeList(currTreeNode, currTreeDataItem.ChildList, this.toDataInfo)
          }
          this.treeData.push(currTreeNode)
        }
        if (this.afterReadData) {
          this.afterReadData()
        }
        this.afterLoadPage()
      })
    },
    saveInfo() {
      if (this.beforeSaveInfo) {
        this.beforeSaveInfo()
      }
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const postData = this.$qs.stringify(this.rowData)
          request({
            url: this.saveUrl,
            method: 'post',
            data: postData,
            manageProductID: this.manageProductID
          }).then(response => {
            this.saveLoading = false
            if (response.data.ResultCode !== '0') {
              this.$message.error(response.data.ResultMessage)
            } else {
              // if(response.data.Data) {
              //   Object.assign(this.rowData, response.data.Data)
              // }
              // // if (this.rowData[this.tableKeyName] === '' || this.rowData[this.tableKeyName] === 0) {
              // if (this.rowData['Manage_LogType'] == 1) {
              //   this.rowData[this.tableKeyName] = response.data.Data[this.tableKeyName]
              //   // this.tableDataInfo.Data.unshift(this.rowData)
              //   this.tableDataInfo.Data.push(this.rowData)
              // } else {
              //   for (const v of this.tableDataInfo.Data) {
              //     if (v[this.tableKeyName] === this.rowData[this.tableKeyName]) {
              //       const index = this.tableDataInfo.Data.indexOf(v)
              //       this.tableDataInfo.Data.splice(index, 1, this.rowData)
              //       break
              //     }
              //   }
              // }
              this.readData()
              this.hideEditDialog()
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              if (this.afterSaveProcess) {
                this.afterSaveProcess(response.data.Data)
              }
            }
            
          })
        }
      })
    },
    saveTreeInfo() {
      if (this.beforeSaveInfo) {
        this.beforeSaveInfo()
      }
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const postData = this.$qs.stringify(this.rowData)
          request({
            url: this.saveUrl,
            method: 'post',
            data: postData,
            manageProductID: this.manageProductID
          }).then(response => {
            this.saveLoading = false
            if (response.data.ResultCode !== '0') {
              this.$message.error(response.data.ResultMessage)
            } else {
              if (this.rowData.id === 0 || this.rowData.id === '') {
                this.rowData = this.toDataInfo(response.data.Data)
                if (this.rowData.parentID === this.treeRootID) {
                  this.appendTreeRoot(this.rowData)
                } else {
                  this.appendTree()
                }
                this.hideEditDialog()
              } else {
                var dataIndex = 0
                if (this.rowData.parentID === this.treeRootID) {
                  for (const currData of this.treeData) {
                    if (this.rowData.parentID === this.treeRootID) {
                      if (currData.id === this.rowData.id) {
                        this.treeData.splice(dataIndex, 1, this.rowData)
                        break
                      }
                    }
                    dataIndex++
                  }
                } else {
                  var idPathList = []
                  if (this.rowData.idPath.startsWith(',')) {
                    idPathList = this.rowData.idPath.substring(1, this.rowData.idPath.length - 1).split(',')
                  } else {
                    idPathList = this.rowData.idPath.substring(0, this.rowData.idPath.length - 1).split(',')
                  }
                  this.setTreeData(this.treeData, idPathList, idPathList[0])
                }
                this.viewData = Object.assign({}, this.rowData)
                this.hideEditDialog()
              }
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            }
            
          })
        }
      })
    },
    showEditDialog() {
      this.dialogEditVisible = true
    },
    hideEditDialog() {
      this.dialogEditVisible = false
    },
    writeLogOperation(manage_LogType, manage_LogTitle) {
      if (this.isLogOperate) {
        this.rowData.Manage_IsLog = true
        this.rowData.Manage_LogType = manage_LogType
        this.rowData.Manage_LogTitle = manage_LogTitle
      }
    },
    writeLogOperationUrl(manage_LogType, manage_LogTitle) {
      this.logParms = ''
      if (this.isLogOperate) {
        this.logParms += 'Manage_IsLog=true'
        this.logParms += '&Manage_LogType=' + manage_LogType
        this.logParms += '&Manage_LogTitle=' + manage_LogTitle
      }
      return this.logParms
    },
    handleCreate() {
      this.saveLoading = false
      this.setRowData()
      this.showEditDialog()
      if (this.$refs['editForm']) {
        this.$nextTick(() => {
          this.$refs['editForm'].clearValidate()
        })
      }
      this.writeLogOperation(this.logOperationType.Insert, this.dialogEditTitle)
    },
    handleEdit(row) {
      this.saveLoading = false
      this.showEditDialog()
      this.rowData = Object.assign({}, row)
      if (this.$refs['editForm']) {
        this.$nextTick(() => {
          this.$refs['editForm'].clearValidate()
        })
      }
      if (this.$refs.DataTable) {
        this.$refs.DataTable.setCurrentRow(row)
      }
      this.writeLogOperation(this.logOperationType.Update, this.dialogEditTitle)
    },
    handleSearch() {
      this.readOptions.PageIndex.Value = 0
      this.readData()
    },
    handleSort(column) {
      if (column.order === 'ascending') {
        this.columnSort = 'Asc'
      } else if (column.order === 'descending') {
        this.columnSort = 'Desc'
      } else {
        this.columnSort = ''
      }
      for (var option in this.readOptions) {
        if (this.readOptions[option].QueryType === 'Sort') {
          delete this.readOptions[option]
        }
      }
      if (this.readOptions[column.prop]) {
        this.readOptions[column.prop].Value = this.columnSort
      } else {
        this.readOptions[column.prop] = this.setQuerySortValue(this.columnSort)
      }

      this.tableDataInfo = []
      this.readData()
    },
    handleTriggerParentEvent(methodName, parms1, parms2) {
      if (this.$parent[methodName]) {
        this.$parent[methodName](parms1, parms2)
      } else if (this.$parent.$parent[methodName]) {
        this.$parent.$parent[methodName](parms1, parms2)
      } else if (this.$parent.$parent.$parent[methodName]) {
        this.$parent.$parent.$parent[methodName](parms1, parms2)
      } else if (this.$parent.$parent.$parent.$parent[methodName]) {
        this.$parent.$parent.$parent.$parent[methodName](parms1, parms2)
      } else if (this.$parent.$parent.$parent.$parent.$parent[methodName]) {
        this.$parent.$parent.$parent.$parent.$parent[methodName](parms1, parms2)
      } else if (this.$parent.$parent.$parent.$parent.$parent.$parent[methodName]) {
        this.$parent.$parent.$parent.$parent.$parent.$parent[methodName](parms1, parms2)
      } else if (this.$parent.$parent.$parent.$parent.$parent.$parent.$parent[methodName]) {
        this.$parent.$parent.$parent.$parent.$parent.$parent.$parent[methodName](parms1, parms2)
      } else if (this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent[methodName]) {
        this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent[methodName](parms1, parms2)
      } else if (this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent[methodName]) {
        this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent[methodName](parms1, parms2)
      } else if (this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent[methodName]) {
        this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent[methodName](parms1, parms2)
      }
    },
    pageSizeChange(val) {
      this.readOptions.PageSize.Value = val
      this.readData()
    },
    rowContextmenu(row, column, event) {
      // 兼容旧版本Element-Ui
      var currEvent = column
      if (!currEvent.returnValue) {
        currEvent = event
      }
      this.rowData = row
      this.contentPosition.left = currEvent.clientX
      this.contentPosition.top = currEvent.clientY
      this.contentMenuVisible = true
      currEvent.returnValue = false
      if (this.$refs.DataTable) {
        this.$refs.DataTable.setCurrentRow(row)
      }
    },
    rowTreeContextmenu(event, row, node) {
      this.rowData = row
      this.contentPosition.left = event.clientX
      this.contentPosition.top = event.clientY
      this.contentMenuVisible = true
      event.returnValue = false
    },
    selectRow(selector, row) {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      var rows = el.children
      var currRow = rows[this.tableDataInfo.Data.indexOf(row)]
      if (currRow.classList.contains('current-row')) {
        currRow.classList['remove']('current-row')
      } else {
        currRow.classList['add']('current-row')
      }
    },
    pageIndexChange(val) {
      this.readOptions.PageIndex.Value = val - 1
      this.readData()
    },
    avatarImageUploadLimit(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    handleDelete(row) {
      return new Promise((resolve, reject) => {
        this.$confirm('确认删除').then(_ => {
          this.writeLogOperationUrl(this.logOperationType.Delete, '删除记录')
          console.log(this.tableKeyName, row)
          request({
            url: this.deleteUrl + '?' + this.tableKeyName + '=' + row[this.tableKeyName] + '&' + this.logParms,
            method: 'get',
            manageProductID: this.manageProductID
          }).then(response => {
            if (response.data.ResultCode !== '0') {
              this.$message.error(response.data.ResultMessage)
              reject(response.data)
            } else {
              this.hideEditDialog()
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              const index = this.tableDataInfo.Data.indexOf(row)
              this.tableDataInfo.Data.splice(index, 1)
              resolve(true)
            }
          })
        })
      })
    },
    handleDeleteMulti() {
      var selections = this.getTableSelection()
      if (selections === '') {
        this.$message.warning('请选择要删除的数据！')
        return
      }
      this.$confirm('确认删除').then(_ => {
        this.writeLogOperationUrl(this.logOperationType.Delete, '批量删除记录')
        request({
          url: this.deleteUrl + '?' + this.tableKeyName + '=' + selections + '&' + this.logParms,
          method: 'get',
          manageProductID: this.manageProductID
        }).then(response => {
          if (response.data.ResultCode !== '0') {
            this.$message.error(response.data.ResultMessage)
          } else {
            this.hideEditDialog()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.readData()
          }
        })
      })
    },
    handleTreeDelete(node, data) {
      this.$confirm('确认删除').then(_ => {
        this.writeLogOperation(this.logOperationType.Delete, '删除')
        request({
          url: this.deleteUrl,
          method: 'get',
          params: { id: data.id },
          manageProductID: this.manageProductID
        }).then(response => {
          if (response.data.ResultCode !== '0') {
            this.$message.error(response.data.ResultMessage)
          } else {
            node.remove(data)
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.rowData = {}
            this.viewData = {}
            this.showDetail(this.rowData)
          }
        })
      })
    },
    handleTableCellDbClick(row, column, cell, event) {
      clip(cell.innerText, event)
    },
    toContentMenuData(data) {
      var currContentMenu = []
      data.forEach(element => {
        currContentMenu.push({
          icon: 'fa fa-' + element.icon,
          name: element.title,
          commandName: element.commandName,
          commandParms: element.commandParms,
          showCondition: element.showCondition,
          color: element.color,
          path: element.path
        })
      })
      return currContentMenu
    },
    setTreeData(currDataList, idPath, currId) {
      var dataIndex = 0
      if (idPath.length > 1) {
        idPath.shift()
        if (currId === this.treeRootID.toString()) {
          this.setTreeData(currDataList, idPath, idPath[0])
        } else {
          for (const currData of currDataList) {
            if (currData.id.toString() === currId) {
              this.setTreeData(currData.children, idPath, idPath[0])
              break
            }
          }
        }
      } else {
        for (const currData of currDataList) {
          if (currData.id === this.rowData.id) {
            currDataList.splice(dataIndex, 1, this.rowData)
            break
          }
          dataIndex++
        }
      }
    },
    addTreeData(currDataList, idPath, currId) {
      if (idPath.length > 1) {
        idPath.shift()
        if (currId === this.treeRootID.toString()) {
          this.addTreeData(currDataList, idPath, idPath[0])
        } else {
          for (const currData of currDataList) {
            if (currData.id.toString() === currId) {
              this.addTreeData(currData.children, idPath, idPath[0])
              break
            }
          }
        }
      } else {
        currDataList.push(this.rowData)
      }
    },
    appendTreeRoot() {
      const newChild = Object.assign({}, this.rowData)
      this.treeData.push(newChild)
    },
    appendTree() {
      var idPathList = []
      if (this.rowData.idPath.startsWith(',')) {
        idPathList = this.rowData.idPath.substring(1, this.rowData.idPath.length - 1).split(',')
      } else {
        idPathList = this.rowData.idPath.substring(0, this.rowData.idPath.length - 1).split(',')
      }
      this.addTreeData(this.treeData, idPathList, idPathList[0])
    },
    handleDragTreeEnd(draggingNode, dropNode, dropType, ev) {
      var targetId = dropNode.data.id
      if (targetId === draggingNode.data.id) {
        return
      }
      this.$confirm('确认移动？').then(_ => {
        request({
          url: this.moveUrl,
          method: 'get',
          params: { id: draggingNode.data.id, moveType: dropType, targetId: targetId },
          manageProductID: this.manageProductID
        }).then(response => {
          if (response.data.ResultCode !== '0') {
            this.$message.error(response.data.ResultMessage)
            this.treeData = []
            this.readTreeData()
          } else {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          }
        })
      }).catch(action => {
        this.$message.error('取消移动')
        this.treeData = []
        this.readTreeData()
      })
    },
    allowTreeDrop(draggingNode, dropNode, type) {
      return type === 'inner' || type === 'prev' || type === 'next'
    },
    allowTreeDrag(draggingNode) {
      return draggingNode.data.menuType !== '1'
    },
    getChildTreeList(currData, childList, toDataFun) {
      for (var j = 0; j < childList.length; j++) {
        var currTreeDataItem = childList[j]
        var currTreeNode = toDataFun(currTreeDataItem)
        currTreeNode.children.push()
        this.getChildTreeList(currTreeNode, currTreeDataItem.ChildList, toDataFun)
        currData.children.push(currTreeNode)
      }
    },
    getChildContentMenu(currContentMenu, routeName, currDataList) {
      for (var i = 0; i < currDataList.length; i++) {
        if (currDataList[i].name.split(':')[0] === routeName.split(':')[0]) {
          if (currDataList[i].buttons && currDataList[i].buttons.length > 0) {
            currDataList[i].buttons.forEach(element => {
              if (element.buttonplace === 2) {
                currContentMenu.push(element)
              }
            })
          }
        } else {
          if (currDataList[i].children) {
            this.getChildContentMenu(currContentMenu, routeName, currDataList[i].children)
          }
        }
      }
    },
    getTableSelection(tableRef, keyName) {
      if (!tableRef) {
        tableRef = 'DataTable'
      }
      if (!keyName) {
        keyName = this.tableKeyName
      }
      var selection = this.$refs[tableRef].store.states.selection
      var selectKeys = []
      if (selection.length > 0) {
        selection.forEach(ele => {
          selectKeys.push(ele[keyName])
        })
      }
      return selectKeys.toString()
    },
    setSortTable() {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          var oldIndex = evt.oldIndex
          var newIndex = evt.newIndex
          var moveType = 'before'
          if (oldIndex > newIndex) {
            moveType = 'after'
          }
          var moveItem = this.tableDataInfo.Data[oldIndex]
          var targetRow = this.tableDataInfo.Data[newIndex]
          this.tableDataInfo.Data.splice(oldIndex, 1)
          this.tableDataInfo.Data.splice(newIndex, 0, moveItem)
          if (newIndex !== oldIndex) {
            this.$confirm('确认移动？').then(_ => {
              this.writeLogOperationUrl(this.logOperationType.MoveRow, '移动记录')
              request({
                url: this.moveUrl + '?' + this.tableKeyName + '=' + moveItem[this.tableKeyName],
                method: 'get',
                params: { moveType: moveType, targetId: targetRow[this.tableKeyName] },
                manageProductID: this.manageProductID
              }).then(response => {
                if (response.data.ResultCode !== '0') {
                  this.readData()
                  this.$message.error(response.data.ResultMessage)
                } else {
                  this.hideEditDialog()
                  this.$message.success('移动成功')
                }
              })
            }).catch(action => {
              this.$message.error('取消移动')
              this.readData()
            })
          }
        }
      })
    },
    getPageCoteID() {
      var currPath = location.hash
      if (currPath.split('/').length > 2) {
        var pageCode = currPath.split('/')[1]
        if (pageCode.split('$').length > 1) {
          this.pageCoteID = pageCode.split('$')[1]
        }
      }
    },
    setEChartSeriesData(name, data, type, color) {
      return {
        name: name, itemStyle: {
          normal: {
            color: color,
            lineStyle: {
              color: color,
              width: 2
            }
          }
        },
        smooth: true,
        type: type,
        data: data,
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      }
    }
  }
}
export default contentProcess
