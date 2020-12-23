import { asyncRouterMap, constantRouterMap, asyncRouterGroup } from '@/router'
import store from '../index'
import Layout from '@/views/layout/Layout'
import AppMain from '@/views/layout/components/AppMain.vue'
import { getAsyncRouter } from '@/api/asyncRouter'
import Cookies from 'js-cookie'
function getChildMenuList(currData, menuList, groupID) {
  if (menuList.length > 0) {
    currData.children = []
  }
  menuList.forEach(element => {
    var currChildData
    if (element.MenuItemDtoList.length === 0 || (element.MenuItemDtoList.length === 1 && element.MenuItemDtoList[0].IsHidden)) {
      currChildData = {
        path: element.Path,
        component: () => import(`@/views${element.ViewPath}`),
        name: element.MenuID,
        hidden: element.IsHidden,
        meta:
        {
          groupID: groupID,
          title: element.MenuName,
          icon: element.MenuIcon
        }
      }
    } else {
      currChildData = {
        path: element.Path,
        component: AppMain,
        redirect: element.ViewPath,
        name: element.MenuID,
        hidden: element.IsHidden,
        meta:
        {
          groupID: groupID,
          title: element.MenuName,
          icon: element.MenuIcon
        }
      }
    }

    getChildMenuList(currChildData, element.MenuItemDtoList, groupID)
    getFunMenuList(currChildData, element.MenuButtonDtoList)
    currData.children.push(currChildData)
  })
}

function getFunMenuList(currData, buttonList) {
  buttonList.forEach(element => {
    var currButtonData = {
      buttonplace: element.ButtonPlace,
      icon: element.Icon,
      name: element.ID,
      title: element.Title,
      commandName: element.CommandName,
      commandParms: element.CommandParms,
      showCondition: element.ShowCondition,
      hidden: element.IsHidden,
      path: element.Path,
      color: element.ButtonColor
    }
    if (currData.buttons) {
      currData.buttons.push(currButtonData)
    } else {
      currData.buttons = []
      currData.buttons.push(currButtonData)
    }
  })
}
const permission = {
  state: {
    routers: constantRouterMap,
    routergroup: [],
    addRouters: [],
    isLoadRooter: false
  },
  mutations: {
    SET_ROUTERS: (state, router) => {
      state.addRouters = router.data
      state.routers = constantRouterMap.concat(router.data)
      state.routergroup = router.group
      state.isLoadRooter = true
    }
  },
  actions: {
    GetAsyncRoutes({ commit }) {
      return new Promise((resolve, reject) => {
        getAsyncRouter().then(response => {
          if (!response.data) {
            reject('error')
          }
          var currGroupData = response.data.Data
          for (var i = 0; i < currGroupData.length; i++) {
            var currMenuGroupData = currGroupData[i]
            asyncRouterGroup.push({
              id: currMenuGroupData.MenuID,
              title: currMenuGroupData.MenuName,
              icon: currMenuGroupData.MenuIcon
            })
            console.info(Cookies.get('topmodule'))
            if (i === 0 && (Cookies.get('topmodule') === '' || Cookies.get('topmodule') === undefined)) {
              store.dispatch('toggleModule', currMenuGroupData.MenuID)
            }
            currMenuGroupData.MenuItemDtoList.forEach(element => {
              var currRouterData = {
                path: element.Path,
                component: Layout,
                name: element.MenuID,
                redirect: element.ViewPath,
                hidden: element.IsHidden,
                meta:
                {
                  groupID: currMenuGroupData.MenuID,
                  title: element.MenuName,
                  icon: element.MenuIcon
                }
              }
              getChildMenuList(currRouterData, element.MenuItemDtoList, currMenuGroupData.MenuID)
              getFunMenuList(currRouterData, element.MenuButtonDtoList)
              asyncRouterMap.push(currRouterData)
            })
          }
          console.info(asyncRouterMap)
          commit('SET_ROUTERS', { data: asyncRouterMap, group: asyncRouterGroup })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
export default permission
