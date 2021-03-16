// 售前模块的路由管理
export default [
  { path: '/pre-sales/', redirect: '/pre-sales/dashboard' },
  { path: '/pre-sales/dashboard', component: 'dashboard/pre_index', access: 'presale-panel' },
  { path: '/pre-sales/order', redirect: '/pre-sales/order/advertise' },

  { path: '/pre-sales/order/advertise', component: 'order/preSales/list', access: 'menu:presale-order-list' },
  { path: '/pre-sales/order/audit_not', component: 'order/preSales/list', access: 'menu:presale-order-list-audit_not' },
  { path: '/pre-sales/order/audited', component: 'order/preSales/list', access: 'menu:presale-order-list-audited' },
  { path: '/pre-sales/order/distribute_not', component: 'order/preSales/list', access: 'menu:presale-order-list-distribute_not' },
  { path: '/pre-sales/order/distributed', component: 'order/preSales/list', access: 'menu:presale-order-list-distributed' },
  { path: '/pre-sales/order/manual', component: 'order/preSales/list', access: 'menu:presale-order-manual' },
  { path: '/pre-sales/order/repeat', component: 'order/preSales/list', access: 'menu:presale-order-repeat' },
  { path: '/pre-sales/order/invalid',component: 'order/preSales/list', access: 'menu:presale-order-invalid' },
  { path: '/pre-sales/order/abnormal', component: 'order/preSales/list', access: 'menu:presale-order-abnormal' },
  { path: '/pre-sales/order/abnormal_no_dealwith', component: 'order/preSales/list', access: 'menu:presale-order-abnormal-no_dealwith' },
  { path: '/pre-sales/order/abnormal_dealwith', component: 'order/preSales/list', access: 'menu:presale-order-abnormal-dealwith' },
  { path: '/pre-sales/order/askforcancel', component: 'order/preSales/list', access: 'menu:presale-order-askforcancel' },
  { path: '/pre-sales/order/askforcancel_no_dealwith', component: 'order/preSales/list', access: 'menu:presale-order-askforcancel-no_dealwith' },
  { path: '/pre-sales/order/askforcancel_cancel_succ', component: 'order/preSales/list', access: 'menu:presale-order-askforcancel-cancel_succ' },
  { path: '/pre-sales/order/askforcancel_cancel_fail', component: 'order/preSales/list', access: 'menu:presale-order-askforcancel-cancel_fail' },
  { path: '/pre-sales/order/askforcancel_place_on', component: 'order/preSales/list', access: 'menu:presale-order-askforcancel-place_on' },

  { path: '/pre-sales/order/create/general', component: 'order/preSales/manual', layout: { hideMenu: true }, title: 'app.common.manualOrder' },

  { path: '/pre-sales/order/:id/edit/redelivery', component: 'order/preSales/edit', layout: { hideMenu: true }, title: 'app.common.redeliveryOrders' },
  { path: '/pre-sales/order/:id/edit/replenish', component: 'order/preSales/edit', layout: { hideMenu: true }, title: 'app.common.replenishOrders' },
  { path: '/pre-sales/order/:id/edit/askforcancel', component: 'order/preSales/edit', layout: { hideMenu: true }, title: 'app.common.orderDetail' },
  { path: '/pre-sales/order/:id/edit/abnormal_redelivery', component: 'order/preSales/edit', layout: { hideMenu: true }, title: 'app.common.orderDetail' },

  { path: '/pre-sales/order/:id/edit/audit', component: 'order/preSales/audit', layout: { hideMenu: true }, title: 'app.common.orderDetail' },

  { path: '/pre-sales/order/:id/detail', component: 'order/preSales/detail', layout: { hideMenu: true }, title: 'app.common.orderDetail' },
  { path: '/pre-sales/order/:id/detail/audit', component: 'order/preSales/detail', layout: { hideMenu: true }, title: 'app.common.orderDetail' },
  { path: '/pre-sales/order/:id/detail/audited', component: 'order/preSales/detail', layout: { hideMenu: true }, title: 'app.common.orderDetail'},
  { path: '/pre-sales/order/:id/detail/distributed', component: 'order/preSales/detail', layout: { hideMenu: true }, title: 'app.common.orderDetail' },
  { path: '/pre-sales/order/:id/detail/distribute_not', component: 'order/preSales/detail', layout: { hideMenu: true }, title: 'app.common.orderDetail' },
  { path: '/pre-sales/order/:id/detail/invalid', component: 'order/preSales/detail', layout: { hideMenu: true }, title: 'app.common.orderDetail' },
  { path: '/pre-sales/order/:id/detail/repeat', component: 'order/preSales/detail', layout: { hideMenu: true }, title: 'app.common.orderDetail' },
  { path: '/pre-sales/order/:id/detail/abnormal', component: 'order/preSales/detail', layout: { hideMenu: true }, title: 'app.common.orderDetail' },
  { path: '/pre-sales/order/:id/detail/askforcancel', component: 'order/preSales/detail', layout: { hideMenu: true }, title: 'app.common.cancelReportDetail' },
  { path: '/pre-sales/order/:id/detail/manual', component: 'order/preSales/detail', layout: { hideMenu: true }, title: 'app.common.orderDetail' },
  { path: '/pre-sales/order/:id/detail/redelivery', component: 'order/preSales/detail', layout: { hideMenu: true }, title: 'app.common.orderRedeliveryDetail' },
  { path: '/pre-sales/order/:id/detail/replenish', component: 'order/preSales/detail', layout: { hideMenu: true }, title: 'app.common.orderReplenishDetail' },
  { path: '/pre-sales/order/:id/detail/abnormal_redelivery', component: 'order/preSales/detail', layout: { hideMenu: true }, title: 'app.common.orderAbnormalReplenishDetail' },
  
  { path: '/pre-sales/order/:id/repeat_list', component: 'order/preSales/repeat', title: 'app.common.repeatView' },
  // 报表模块
  {
    path: '/pre-sales/report',
    component: 'report/list',
    title: 'app.common.preReport'
  },
  // 客服模块
  {
    path: '/pre-sales/customer',
    redirect: '/pre-sales/customer/list'
  },
  {
    path: '/pre-sales/customer/list',
    component: 'customer/list'
  },
  {
    path: '/pre-sales/customer/:id',
    component: 'customer/layout',
    routes: [
      {
        path: '/pre-sales/customer/:id',
        redirect: '/pre-sales/customer/:id/info',
      },
      {
        path: '/pre-sales/customer/:id/info',
        component: 'customer/info',
        layout: { hideMenu: true }
      },
      {
        path: '/pre-sales/customer/:id/order',
        component: 'customer/order',
        layout: { hideMenu: true }
      },
    ]
  }
]
