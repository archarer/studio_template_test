 
<template>
  <div class="fun-container"  >
    <el-button v-for="item in menuItems.filter(ele=>{return !hiddenMenu(ele.commandName)})"  size="small" :key="item.name" class="filter-item"  :type="item.color"  :icon="'fa fa-'+item.icon" @click="handleCommand(item)">{{item.title}}</el-button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TopMenu',
  props: {
    hiddenMenus: {
      type: Array,
      default() {
        return []
      }
    },
    menus: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    ...mapGetters([
      'addRouters'
    ])
  },
  data() {
    return {
      menuItems: []
    }
  },
  created() {
    if (this.menus.length > 0) {
      this.menuItems = this.menus
    } else {
      this.readData()
    }
  },
  methods: {
    readData() {
      this.setMenuData(this.addRouters)
    },
    setMenuData(currDataList) {
      for (var i = 0; i < currDataList.length; i++) {
        if (currDataList[i].name.split(':')[0] === this.$route.name.split(':')[0]) {
          if (currDataList[i].buttons) {
            currDataList[i].buttons.forEach(element => {
              if (element.buttonplace === 1 && !element.hidden) {
                this.menuItems.push(element)
              }
            })
          }
        } else {
          if (currDataList[i].children) {
            this.setMenuData(currDataList[i].children)
          }
        }
      }
    },
    handleCommand(item) {
      if (item.path) {
        this.$router.push({ path: item.path })
      } else {
        this.handleTriggerParentEvent('handleTopMenuCommand', item.commandName, item.commandParms)
      }
    },
    hiddenMenu(commandName) {
      if (this.hiddenMenus && this.hiddenMenus.indexOf(commandName) > -1) {
        return true
      }
      return false
    }
  }
}
</script>