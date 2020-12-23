<template>
      <el-tabs>
        <el-tab-pane label="网页" name="1">
          <span v-for="item in webIconList"  :key="item" class="menuicon" @click="handleCommand(item)" ><i :class="'fa fa-'+item"></i></span>
        </el-tab-pane>
        <el-tab-pane label="辅助功能" name="2">
          <span v-for="item in accessibilityIconList"  :key="item" class="menuicon" @click="handleCommand(item)" ><i :class="'fa fa-'+item"></i></span>
        </el-tab-pane>
        <el-tab-pane label="手势" name="3">
          <span v-for="item in handIconList"  :key="item" class="menuicon" @click="handleCommand(item)" ><i :class="'fa fa-'+item"></i></span>
        </el-tab-pane>
        <el-tab-pane label="运输" name="4">
          <span v-for="item in transportationIconList"  :key="item" class="menuicon" @click="handleCommand(item)" ><i :class="'fa fa-'+item"></i></span>
        </el-tab-pane>
        <el-tab-pane label="性别" name="5">
          <span v-for="item in genderIconList"  :key="item" class="menuicon" @click="handleCommand(item)" ><i :class="'fa fa-'+item"></i></span> 
        </el-tab-pane>
        <el-tab-pane label="文件类型" name="6">
          <span v-for="item in fileTypeIconList"  :key="item" class="menuicon" @click="handleCommand(item)" ><i :class="'fa fa-'+item"></i></span>
        </el-tab-pane>
        <el-tab-pane label="可旋转" name="7">
          <span v-for="item in spinnerIconList"  :key="item" class="menuicon" @click="handleCommand(item)" ><i :class="'fa fa-'+item"></i></span>
        </el-tab-pane>
        <el-tab-pane label="表单" name="8">
          <span v-for="item in formControlIconList"  :key="item" class="menuicon" @click="handleCommand(item)" ><i :class="'fa fa-'+item"></i></span>
        </el-tab-pane>
        <el-tab-pane label="支付" name="9">
          <span v-for="item in paymentIconList"  :key="item" class="menuicon" @click="handleCommand(item)" ><i :class="'fa fa-'+item"></i></span>
        </el-tab-pane>
        <el-tab-pane label="图表" name="10">
          <span v-for="item in chartIconList"  :key="item" class="menuicon" @click="handleCommand(item)" ><i :class="'fa fa-'+item"></i></span>
        </el-tab-pane>
        <el-tab-pane label="货币" name="11">
          <span v-for="item in currencyIconList"  :key="item" class="menuicon" @click="handleCommand(item)" ><i :class="'fa fa-'+item"></i></span>
        </el-tab-pane>
        <el-tab-pane label="文本编辑" name="12">
          <span v-for="item in textEditorIconList"  :key="item" class="menuicon" @click="handleCommand(item)" ><i :class="'fa fa-'+item"></i></span>
        </el-tab-pane>
        <el-tab-pane label="指示方向" name="13">
          <span v-for="item in directionIconList"  :key="item" class="menuicon" @click="handleCommand(item)" ><i :class="'fa fa-'+item"></i></span>
        </el-tab-pane>
        <el-tab-pane label="视频播放" name="14">
          <span v-for="item in videoPlayerIconList"  :key="item" class="menuicon" @click="handleCommand(item)" ><i :class="'fa fa-'+item"></i></span>
        </el-tab-pane>
        <el-tab-pane label="标志" name="15">
          <span v-for="item in brandIconList"  :key="item" class="menuicon" @click="handleCommand(item)" ><i :class="'fa fa-'+item"></i></span>
        </el-tab-pane>
      </el-tabs>
</template>

<script>
export default {
  name: 'FontAwesome',
  data() {
    return {
      webIconList: [
        'address-book',
        'address-book-o',
        'address-card',
        'address-card-o',
        'adjust',
        'anchor',
        'archive',
        'arrows-h',
        'bars',
        'book',
        'bullhorn',
        'calculator',
        'camera-retro',
        'cc',
        'comment-o',
        'envelope',
        'edit',
        'trash-o',
        'plus-circle',
        'search',
        'bullseye',
        'bookmark-o',
        'bomb',
        'calendar-plus-o',
        'hand-o-up',
        'hand-o-down',
        'hand-scissors-o',
        'hand-o-left',
        'file-image-o',
        'google-wallet',
        'area-chart',
        'bar-chart',
        'yen',
        'link',
        'paperclip',
        'scissors',
        'envira',
        'line-chart',
        'pie-chart',
        'bar-chart-o',
        'backward',
        'video-camera',
        'eye',
        'clone',
        'wifi',
        'superpowers',
        'shopping-cart',
        'copy'
      ],
      accessibilityIconList: [
        'american-sign-language-interpreting',
        'assistive-listening-systems',
        'blind',
        'braille',
        'deaf',
        'wheelchair',
        'low-vision',
        'question-circle-o',
        'volume-control-phone'
      ],
      handIconList: [
        'hand-grab-o',
        'hand-lizard-o',
        'hand-o-down',
        'hand-o-left',
        'hand-o-right',
        'hand-o-up',
        'hand-paper-o',
        'hand-peace-o',
        'hand-pointer-o',
        'hand-rock-o',
        'hand-scissors-o',
        'hand-spock-o',
        'hand-stop-o',
        'thumbs-down',
        'thumbs-o-down',
        'thumbs-o-up',
        'thumbs-up'
      ],
      transportationIconList: [
        'ambulance',
        'automobile',
        'bicycle',
        'bus',
        'cab',
        'car',
        'fighter-jet',
        'motorcycle',
        'plane',
        'rocket',
        'ship',
        'space-shuttle',
        'subway',
        'taxi',
        'train',
        'truck'
      ],
      genderIconList: [
        'genderless',
        'intersex',
        'mars',
        'mars-double',
        'mars-stroke',
        'mars-stroke-h',
        'mars-stroke-v',
        'mercury',
        'neuter',
        'transgender',
        'transgender-alt',
        'venus',
        'venus-double',
        'venus-mars'
      ],
      fileTypeIconList: [
        'file',
        'file-archive-o',
        'file-audio-o',
        'file-code-o',
        'file-excel-o',
        'file-image-o',
        'file-movie-o',
        'file-o',
        'file-pdf-o',
        'file-powerpoint-o',
        'file-sound-o',
        'file-text',
        'file-text-o',
        'file-word-o',
        'file-zip-o'
      ],
      spinnerIconList: [
        'circle-o-notch',
        'cog',
        'refresh',
        'spinner'
      ],
      formControlIconList: [
        'check-square',
        'check-square-o',
        'circle',
        'circle-o',
        'dot-circle-o',
        'minus-square',
        'minus-square-o',
        'plus-square',
        'plus-square-o',
        'square',
        'square-o'
      ],
      paymentIconList: [
        'cc-amex',
        'cc-diners-club',
        'cc-discover',
        'cc-jcb',
        'cc-mastercard',
        'cc-paypal',
        'cc-stripe',
        'cc-visa',
        'credit-card',
        'credit-card-alt',
        'google-wallet',
        'paypal'
      ],
      chartIconList: [
        'area-chart',
        'bar-chart',
        'bar-chart-o',
        'line-chart',
        'pie-chart'
      ],
      currencyIconList: [
        'btc',
        'cny',
        'dollar',
        'eur',
        'gbp',
        'gg',
        'krw',
        'gg-circle',
        'ils',
        'inr',
        'money',
        'rouble',
        'rupee',
        'try',
      ],
      textEditorIconList: [
        'align-center',
        'align-justify',
        'align-left',
        'align-right',
        'bold',
        'chain',
        'chain-broken',
        'clipboard',
        'columns',
        'copy',
        'cut',
        'dedent',
        'eraser',
        'files-o',
        'floppy-o',
        'font',
        'header',
        'indent',
        'italic',
        'list',
        'list-alt',
        'list-ol',
        'list-ul',
        'outdent',
        'paperclip',
        'paragraph',
        'paste',
        'repeat',
        'rotate-left',
        'scissors',
        'strikethrough',
        'subscript',
        'superscript',
        'table',
        'text-height',
        'text-width',
        'th',
        'th-large',
        'th-list',
        'underline',
      ],
      directionIconList: [
        'angle-double-down',
        'angle-double-left',
        'angle-double-right',
        'angle-double-up',
        'angle-down',
        'angle-left',
        'angle-right',
        'angle-up',
        'arrow-circle-down',
        'arrow-circle-left',
        'arrow-circle-right',
        'arrow-circle-up',
        'arrow-circle-o-down',
        'arrow-circle-o-left',
        'arrow-circle-o-right',
        'arrow-circle-o-up',
        'arrow-down',
        'arrow-left',
        'arrow-right',
        'arrow-up',
        'arrows',
        'arrows-alt',
        'arrows-h',
        'arrows-v',
        'caret-down',
        'caret-left',
        'caret-right',
        'careg-up',
        'chevron-down',
        'chevron-left',
        'chevron-right',
        'chevron-up',
        'long-arrow-down',
        'long-arrow-left',
        'long-arrow-right',
        'long-arrow-up'
      ],
      videoPlayerIconList: [
        'arrows-alt',
        'backward',
        'compress',
        'eject',
        'expand',
        'fast-backward',
        'fast-forward',
        'forward',
        'pause',
        'pause-circle',
        'pause-circle-o',
        'play',
        'play-circle',
        'play-circle-o',
        'random',
        'step-backward',
        'step-forward',
        'stop',
        'stop-circle',
        'stop-circle-o',
        'youtube-play'
      ],
      brandIconList: [
        '500px',
        'adn',
        'amazon',
        'android',
        'angelist',
        'apple',
        'bandcamp',
        'behance',
        'bitbucket',
        'btc',
        'chrome',
        'codepen',
        'codiepie',
        'delicious',
        'deviantart',
        'digg',
        'dashcube',
        'connectdevelop',
        'contao',
        'css3',
        'edge',
        'envira',
        'empire',
        'facebook',
        'first-order',
        'gg',
        'github',
        'git',
        'gitlab',
        'google',
        'internet-explorer',
        'html5',
        'jsfiddle',
        'linkedin',
        'linux',
        'qq',
        'reddit',
        'skype',
        'share-alt',
        'opera',
        'twitch',
        'twitter',
        'usb',
        'wechat',
        'yahoo',
        'yelp',
        'weibo',
        'youtube'
      ]
    }
  },
  methods: {
    handleCommand(icon) {
      if (this.$parent.selectMenuIcon) {
        this.$parent.selectMenuIcon(icon)
      } else if (this.$parent.$parent.$parent.selectMenuIcon) {
        this.$parent.$parent.$parent.selectMenuIcon(icon)
      } else if (this.$parent.$parent.$parent.$parent.selectMenuIcon) {
        this.$parent.$parent.$parent.$parent.selectMenuIcon(icon)
      } else if (this.$parent.$parent.$parent.$parent.$parent.selectMenuIcon) {
        this.$parent.$parent.$parent.$parent.$parent.selectMenuIcon(icon)
      } else if (this.$parent.$parent.$parent.$parent.$parent.$parent.selectMenuIcon) {
        this.$parent.$parent.$parent.$parent.$parent.$parent.selectMenuIcon(icon)
      }
    }
  }
}
</script>
<style scoped>
.menuicon {
 padding: 5px;
 cursor: pointer;
}
</style>

