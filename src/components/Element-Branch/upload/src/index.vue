<script>
import UploadList from './upload-list'
import Upload from './upload'
import ElProgress from 'element-ui/packages/progress'
import Migrating from 'element-ui/src/mixins/migrating'
function noop() {}

export default {
  name: 'el-upload-branch',

  mixins: [Migrating],

  components: {
    ElProgress,
    UploadList,
    Upload
  },

  provide() {
    return {
      uploader: this
    }
  },

  inject: {
    elForm: {
      default: ''
    }
  },

  props: {
    action: {
      type: String,
      default() {
        if (window.Global.PRODUCTID) {
          return window.Global.POWER_API + '/core/uploadfiles?manage-productid=' + window.Global.PRODUCTID
        }
        return window.Global.POWER_API + '/core/uploadfiles'
      }
    },
    headers: {
      type: Object,
      default() {
        return {}
      }
    },
    fieldName: String,
    data: Object,
    multiple: Boolean,
    name: {
      type: String,
      default: 'file'
    },
    value: {
      type: String,
      default: ''
    },
    drag: Boolean,
    dragger: Boolean,
    withCredentials: Boolean,
    showFileList: {
      type: Boolean,
      default: true
    },
    accept: String,
    type: {
      type: String,
      default: 'select'
    },
    beforeUpload: Function,
    beforeRemove: Function,
    onRemove: {
      type: Function,
      default: noop
    },
    onChange: {
      type: Function,
      default: noop
    },
    onPreview: {
      type: Function
    },
    onSuccess: {
      type: Function,
      default: noop
    },
    onProgress: {
      type: Function,
      default: noop
    },
    onError: {
      type: Function,
      default: noop
    },
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    listType: {
      type: String,
      default: 'text' // text,picture,picture-card
    },
    objectId: {
      type: [String, Number],
      default() {
        return ''
      }
    },
    resourceCode: {
      type: String,
      required: true
    },
    restrictCode: {
      type: String,
      required: true
    },
    httpRequest: Function,
    disabled: Boolean,
    limit: Number,
    onExceed: {
      type: Function,
      default: noop
    },
    handleChange: {
      type: Function,
      default: noop
    },
    valueList: {
      type: Array,
      default() {
        return []
      }
    },
    uploadType: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      uploadFiles: [],
      dragOver: false,
      draging: false,
      tempIndex: 1,
      objectIDHasChange: false,
      loading: false,
      showDelete: false,
    }
  },
  computed: {
    uploadDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    },
  },
  created() {
    this.valueList.forEach(element => {
      if (this.value === undefined) {
        this.value = ''
      }
      if (this.value !== '') {
        this.value += '$'
      }
      this.value += element
      this.uploadFiles.push({
        name: element,
        status: 'success',
        uid: (new Date()).getTime(),
        url: element
      })
    })
  },
  watch: {
    fileList: {
      immediate: true,
      handler(fileList) {
        this.uploadFiles = fileList.map(item => {
          item.uid = item.uid || (Date.now() + this.tempIndex++)
          item.status = item.status || 'success'
          return item
        })
      }
    },
    objectId(val) {
      this.objectIDHasChange = true
    },
    valueList(val, oldVal) {
      if (val.toString() !== oldVal.toString() && this.objectIDHasChange) {
        this.value = ''
        this.uploadFiles = []
        val.forEach(element => {
          if (this.value === undefined) {
            this.value = ''
          }
          if (this.value !== '') {
            this.value += '$'
          }
          this.value += element
          this.uploadFiles.push({
            name: element,
            status: 'success',
            uid: (new Date()).getTime(),
            url: element
          })
        })
        this.objectIDHasChange = false
      }
    }
  },

  methods: {
    handleStart(rawFile) {
      rawFile.uid = Date.now() + this.tempIndex++
      const file = {
        status: 'ready',
        name: rawFile.name,
        size: rawFile.size,
        percentage: 0,
        uid: rawFile.uid,
        raw: rawFile
      }
      if (this.listType === 'picture-card' || this.listType === 'picture') {
        try {
          file.url = URL.createObjectURL(rawFile)
        } catch (err) {
          console.error('[Element Error][Upload]', err)
          return
        }
      }

      this.uploadFiles.push(file)
      this.onChange(file, this.uploadFiles)
      this.loading = true
    },
    handleProgress(ev, rawFile) {
      const file = this.getFile(rawFile)
      this.onProgress(ev, file, this.uploadFiles)
      file.status = 'uploading'
      file.percentage = ev.percent || 0
    },
    handleSuccess(res, rawFile) {
      const file = this.getFile(rawFile)
      let value = this.value
      if (file) {
        file.status = 'success'
        file.response = res
        if (res.ResultCode !== '0') {
          this.$message.error(res.ResultMessage)
        } else {
          if (this.multiple) {
            if (value === undefined) {
              value = ''
            }
            if (this.value !== '') {
              value += '$'
            }
            value += res.Data
          } else {
            value = res.Data
          }
          file.url = res.Data
        }
        this.$emit('input', value)
        this.loading = false
        this.onSuccess(res, file, this.uploadFiles)
        this.onChange(value, this.fieldName)
      }
    },
    handleError(err, rawFile) {
      const file = this.getFile(rawFile)
      const fileList = this.uploadFiles
      file.status = 'fail'
      fileList.splice(fileList.indexOf(file), 1)
      this.onError(err, file, this.uploadFiles)
    },
    handleRemove(file, raw) {
      if (raw) {
        file = this.getFile(raw)
      }
      const doRemove = () => {
        this.abort(file)
        const fileList = this.uploadFiles
        fileList.splice(fileList.indexOf(file), 1)
        this.onRemove(file, fileList)
      }

      if (!this.beforeRemove) {
        doRemove()
      } else if (typeof this.beforeRemove === 'function') {
        const before = this.beforeRemove(file, this.uploadFiles)
        if (before && before.then) {
          before.then(() => {
            doRemove()
          }, noop)
        } else if (before !== false) {
          doRemove()
        }
      }
      var currValue = ''
      for (const url of this.value.split('$')) {
        if (url !== file.url) {
          if (currValue !== '') {
            currValue += '$'
          }
          currValue += url
        }
      }
      this.value = currValue
      this.$emit('input', this.value)
      this.onChange(currValue, this.fieldName)
    },
    getFile(rawFile) {
      const fileList = this.uploadFiles
      let target
      fileList.every(item => {
        target = rawFile.uid === item.uid ? item : null
        return !target
      })
      return target
    },
    abort(file) {
      this.$refs['upload-inner'].abort(file)
    },
    clearFiles() {
      this.uploadFiles = []
    },
    submit() {
      this.uploadFiles
        .filter(file => file.status === 'ready')
        .forEach(file => {
          this.$refs['upload-inner'].upload(file.raw)
        })
    },
    getMigratingConfig() {
      return {
        props: {
          'default-file-list': 'default-file-list is renamed to file-list.',
          'show-upload-list': 'show-upload-list is renamed to show-file-list.',
          'thumbnail-mode': 'thumbnail-mode has been deprecated, you can implement the same effect according to this case: http://element.eleme.io/#/zh-CN/component/upload#yong-hu-tou-xiang-shang-chuan'
        }
      }
    },
    removeCurrImage(event) {
      let value = ''
      this.$emit('input', value)
      event.stopPropagation()
      return
    }
  },

  beforeDestroy() {
    this.uploadFiles.forEach(file => {
      if (file.url && file.url.indexOf('blob:') === 0) {
        URL.revokeObjectURL(file.url)
      }
    })
  },

  render(h) {
    let uploadList
    if (this.showFileList) {
      uploadList = (
        <UploadList
          disabled={this.uploadDisabled}
          listType={this.listType}
          files={this.uploadFiles}
          on-remove={this.handleRemove}
          handlePreview={this.onPreview}>
        </UploadList>
      )
    }
    const uploadData = {
      props: {
        type: this.type,
        drag: this.drag,
        action: this.action,
        multiple: this.multiple,
        'before-upload': this.beforeUpload,
        'with-credentials': this.withCredentials,
        headers: this.headers,
        name: this.name,
        data: this.data,
        accept: this.accept,
        fileList: this.uploadFiles,
        autoUpload: this.autoUpload,
        listType: this.listType,
        disabled: this.uploadDisabled,
        limit: this.limit,
        actionType: this.actionType,
        resourceCode: this.resourceCode,
        restrictCode: this.restrictCode,
        'on-exceed': this.onExceed,
        'on-start': this.handleStart,
        'on-progress': this.handleProgress,
        'on-success': this.handleSuccess,
        'on-change': this.handleChange,
        'on-error': this.handleError,
        'on-preview': this.onPreview,
        'on-remove': this.handleRemove,
        'http-request': this.httpRequest
      },
      ref: 'upload-inner'
    }
    var trigger = this.$slots.trigger || this.$slots.default
    if (this.uploadType === 'txt') {
      trigger = <el-button size='mini' loading={this.loading} type='primary'>上传文件</el-button>
    } else if (this.uploadType === 'img') {
      trigger = (
        <div v-loading={this.loading} on-mouseover={() => { this.showDelete = true }} on-mouseout={() => { this.showDelete = false }} >
          <i class='fa fa-minus-circle' v-show={this.showDelete && this.value.length > 0} style='color:red;color: red;position: absolute;right: -6px;top: -6px;' on-click={(event) => this.removeCurrImage(event)}></i>
          <img v-show={this.value && this.value.length > 0} src={this.value} class='avatar' />
          <i v-show={!this.value || this.value.length === 0} class='el-icon-plus avatar-uploader-icon'></i>
        </div>
      )
    }
    const uploadComponent = <upload {...uploadData}>{trigger}</upload>
    return (
      <div>
        { this.listType === 'picture-card' ? uploadList : ''}
        {
          this.$slots.trigger
            ? [uploadComponent, this.$slots.default]
            : uploadComponent
        }
        {this.$slots.tip}
        { this.listType !== 'picture-card' ? uploadList : ''}
      </div>
    )
  }
}
</script>
