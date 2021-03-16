import preRoutes from './preRoutes'
import afterRoutes from './afterRoutes'
import sysRoutes from './sysRoutes'
export default [
  {
    path: '/',
    component: '@/layouts/index',
    routes: [
      {
        path: '/',
        redirect: '/pre-sales'
      },
      {
        path: '/account/login',
        component: 'account/login',
        layout: false,
        access: 'isLogin',
      },
      { 
        path: '/account/password', 
        component: 'account/modify_password', 
        access: 'router:set_password', 
        layout: { hideMenu: true }, title: 'app.global.modifyPassword' 
      },
      {
        path: '/pre-sales',
        title: 'app.common.preSalesManage', // 售前模块的路由管理
        routes: preRoutes,
      },
      {
        path: '/after-sales',
        title: 'app.common.afterSalesManage', // 售后模块的路由管理
        routes: afterRoutes,
      },
      {
        path: '/system',
        title: 'app.common.systemManage', //系统管理
        routes: sysRoutes
      },
    ],
  }
];
