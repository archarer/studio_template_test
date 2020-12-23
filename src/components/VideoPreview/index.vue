<template>
<div class="div_videopreview">
  <el-tag style="cursor: pointer;" @click.native="showVideoVisible=true" :type="videoUrl!==''?'primary':'info'">{{videoUrl===''?'暂无视频':'视频地址'}}</el-tag>
  <el-dialog :append-to-body="true"  :visible.sync="showVideoVisible">
    <iframe :src="videoUrl" width="100%" height="350"></iframe>
  </el-dialog>
</div>
 
</template>


<script>
export default {
  name: 'videoPreview',
  props: {
    videoUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showVideoVisible: false
    }
  }
}
</script>