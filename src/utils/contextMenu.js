export default {
  name: 'airContexMenu',
  data() {
    return {
      triggerShowFn: () => {}
    }
  },
  render(h) {
    var sel = this
    var menuInfo = []
    this.$parent.contentMenuList.forEach((ele) => {
      if (this.$parent.contentHiddenMenus && this.$parent.contentHiddenMenus.length > 0) {
        if (this.$parent.contentHiddenMenus.indexOf(ele.commandName) === -1) {
          menuInfo.push(h('li', {
            style: {
              padding: '0px 20px',
              width: '100%',
              display: this.$parent.contentMenuFilter(this.$parent.rowData, ele.showCondition) ? 'block' : 'none'
            },
            class: ['air-table__context--list', 'ripple'],
            on: {
              click: function() {
                if (ele.path && ele.path !== '') {
                  sel.$router.push({ path: ele.path, query: { selectRowID: sel.$parent.rowData[sel.$parent.tableKeyName] }})
                } else {
                  sel.$parent.handleContentMenuCommand(sel.$parent.rowData, ele.commandName, ele.commandParms)
                  sel.$parent.contentMenuVisible = false
                }
              }
            }
          },
          [
            h('i', {
              class: [ele.icon, 'air-table__context--icon']
            }),
            h('span', { class: ['air-table__context--info'] }, ele.name)
          ]))
        }
      } else {
        menuInfo.push(h('li', {
          style: {
            padding: '0px 20px',
            width: '100%',
            display: this.$parent.contentMenuFilter(this.$parent.rowData, ele.showCondition) ? 'block' : 'none'
          },
          class: ['air-table__context--list', 'ripple'],
          on: {
            click: function() {
              if (ele.path && ele.path !== '') {
                sel.$router.push({ path: ele.path, query: { selectRowID: sel.$parent.rowData[sel.$parent.tableKeyName] }})
              } else {
                sel.$parent.handleContentMenuCommand(sel.$parent.rowData, ele.commandName, ele.commandParms)
                sel.$parent.contentMenuVisible = false
              }
            }
          }
        },
        [
          h('i', {
            class: [ele.icon, 'air-table__context--icon']
          }),
          h('span', { class: ['air-table__context--info'] }, ele.name)
        ]))
      }
    })
    return h(
      'div', {
        style: {
          padding: '8px 0px',
          position: 'fixed',
          left: this.$parent.contentPosition.left + 'px',
          top: this.$parent.contentPosition.top + 'px',
          display: this.$parent.contentMenuVisible ? 'block' : 'none',
          zIndex: 99999,
          backgroundColor: '#fff',
          borderRadius: '4px'
        },
        class: ['air-table__context--menu']
      },
      menuInfo
    )
  },
  computed: {

  },
  created() {

  },
  mounted() {
    this.bindEvents()
  },
  methods: {
    menuClick() {
    },
    bindEvents() {
      this.triggerHideFn = this.clickDocumentHandler.bind(this)
      document.addEventListener('mousedown', this.triggerHideFn)
    },
    clickDocumentHandler(e) {
      if (e.srcElement.className.indexOf && e.srcElement.className.indexOf('air-table__context') === -1) {
        this.$parent.contentMenuVisible = false
      }
    }
  }
}
