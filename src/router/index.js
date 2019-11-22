import Vue from 'vue'
import Router from 'vue-router'
// import { resolve } from 'path'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/guide'
    },
    {
      path: '/guide',
      name: 'guide',
      component: resolve => require(['@/views/guide'], resolve)
    },
    {
      path: '/index',
      name: 'index',
      component: resolve => require(['@/views/index'], resolve)
    },
    {
      path: '/home',
      name: 'home',
      redirect:'/homeIndex',
      component: resolve => require(['@/views/home'], resolve),
      children:[
        /* 首页 */
        {
          path: '/homeIndex',
          name: 'homeIndex',
          component: resolve => require(['@/views/mainPage/homeIndex'], resolve)
        },
        /* 基本水平 */
        {
          path: '/basic',
          name: 'basic',
          component: resolve => require(['@/views/mainPage/basic'], resolve)
        },
        /* 质量水平 */
        {
          path: '/quality',
          name: 'quality',
          component: resolve => require(['@/views/mainPage/quality'], resolve)
        },
        /* 行为水平 */
        {
          path: '/behavior',
          name: 'behavior',
          component: resolve => require(['@/views/mainPage/behavior'], resolve)
        },
        /* 信用水平 */
        {
          path: '/credit',
          name: 'credit',
          component: resolve => require(['@/views/mainPage/credit'], resolve)
        },
        /* 服务水平 */
        {
          path: '/service',
          name: 'service',
          component: resolve => require(['@/views/mainPage/service'], resolve)
        },
        /* 合作水平 */
        {
          path: '/cooperation',
          name: 'cooperation',
          component: resolve => require(['@/views/mainPage/cooperation'], resolve)
        },
        /* 评价水平 */
        {
          path: '/evaluate',
          name: 'evaluate',
          component: resolve => require(['@/views/mainPage/evaluate'], resolve)
        },
      ]
    },
    {
      path: '/depotManage/home',
      name: 'depotManagehome',
      redirect:'/depotManage/overviews',
      component: resolve => require(['@/views/depotManage/home'], resolve),
      children:[
          /*库存概况 */
          {
              path: '/depotManage/overviews',
              name: 'depotManagehome2',
              component: resolve => require(['@/views/depotManage/mainPage/overviews'], resolve)
          },
          /* 项目明细 */
          {
              path: '/depotManage/details',
              name: 'details',
              component: resolve => require(['@/views/depotManage/mainPage/details'], resolve)
          },
          /* 需求预测 */
          {
              path: '/depotManage/forecasts',
              name: 'forecasts',
              component: resolve => require(['@/views/depotManage/mainPage/forecasts'], resolve)
          },
          /* 安全库存 */
          {
              path: '/depotManage/safety_stocks',
              name: 'safety_stocks',
              component: resolve => require(['@/views/depotManage/mainPage/safety_stocks'], resolve)
          },
          /* 备货量 */
          {
              path: '/depotManage/stockings',
              name: 'stockings',
              component: resolve => require(['@/views/depotManage/mainPage/stockings'], resolve)
          },
          /* 智能选商 */
          {
              path: '/depotManage/suppliers',
              name: 'suppliers',
              component: resolve => require(['@/views/depotManage/mainPage/suppliers'], resolve)
          }
      ]
    }
  ]
})
