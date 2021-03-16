export default [
  { path: '/after-sales', redirect: '/after-sales/dashboard' },
  { path: '/after-sales/dashboard', component: 'dashboard/aft_index' },
  { path: '/after-sales/order', redirect: '/after-sales/order/manual' },
  { path: '/after-sales/order/:id/detail', component: 'order/afterSales/detail', layout: { hideMenu: true }, title: 'app.common.orderDetail' },
  { path: '/after-sales/order/:id/detail/audit', component: 'order/afterSales/detail', layout: { hideMenu: true }, title: 'app.common.orderDetail' },
  { path: '/after-sales/order/:id/detail/manual', component: 'order/afterSales/detail', layout: { hideMenu: true }, title: 'app.common.orderDetail' },
  { path: '/after-sales/order/:id/detail/abnormal', component: 'order/afterSales/detail', layout: { hideMenu: true }, title: 'app.common.orderDetail' },
  { path: '/after-sales/order/:id/detail/askforcancel', component: 'order/afterSales/detail', layout: { hideMenu: true }, title: 'app.common.orderDetail' },
  { path: '/after-sales/order/:id/detail/replenish', component: 'order/afterSales/detail', layout: { hideMenu: true }, title: 'app.common.orderReplenishDetail' },
  { path: '/after-sales/order/:id/detail/abnormal_redelivery', component: 'order/afterSales/detail', layout: { hideMenu: true }, title: 'app.common.orderAbnormalReplenishDetail' },
  { path: '/after-sales/order/:id/detail/clue', component: 'order/afterSales/detail', layout: { hideMenu: true }, title: 'app.common.clueOrderDetail' },
  {
    path: '/after-sales/order/:id/detail/redelivery',
    component: 'order/afterSales/detail',
    layout: { hideMenu: true },
    title: 'app.common.orderRedeliveryDetail'
  },

  {
    path: '/after-sales/order/:id/edit/replenish',
    component: 'order/afterSales/edit',
    layout: { hideMenu: true },
    title: 'app.common.replenishOrders'
  },
  {
    path: '/after-sales/order/:id/edit/redelivery',
    component: 'order/afterSales/edit',
    layout: { hideMenu: true },
    title: 'app.common.redeliveryOrders'
  },
  {
    path: '/after-sales/order/:id/edit/askforcancel',
    component: 'order/afterSales/edit',
    layout: { hideMenu: true },
    title: 'app.common.originalOrder'
  },
  {
    path: '/after-sales/order/:id/edit/abnormal_redelivery',
    component: 'order/afterSales/edit',
    layout: { hideMenu: true },
    title: 'app.common.abnormal_redelivery'
  },
  {
    path: '/after-sales/order/:id/edit/reject',
    component: 'order/afterSales/edit',
    layout: { hideMenu: true },
    title: 'app.common.abnormal_redelivery'
  },
  {
    path: '/after-sales/order/create/general/:id?',
    component: 'order/afterSales/manual',
    layout: { hideMenu: true },
    title: 'app.common.manualOrder'
  },
  {
    path: '/after-sales/order/create/clue/:id?',
    component: 'order/afterSales/manual',
    layout: { hideMenu: true },
    title: 'app.common.manualOrder'
  },
  {
    path: '/after-sales/order/:id/edit/clue',
    component: 'order/afterSales/edit',
    layout: { hideMenu: true },
    title: 'app.common.clueOrders'
  },
  {
    path: '/after-sales/order/manual',
    component: 'order/afterSales/list'
  },
  {
    path: '/after-sales/order/audit',
    component: 'order/afterSales/list'
  },
  {
    path: '/after-sales/order/audited',
    component: 'order/afterSales/list'
  },
  {
    path: '/after-sales/order/audit_not',
    component: 'order/afterSales/list'
  },
  {
    path: '/after-sales/order/reject',
    component: 'order/afterSales/list'
  },
  {
    path: '/after-sales/order/abnormal',
    component: 'order/afterSales/list'
  },
  {
    path: '/after-sales/order/abnormal_no_dealwith',
    component: 'order/afterSales/list'
  },
  {
    path: '/after-sales/order/abnormal_dealwith',
    component: 'order/afterSales/list'
  },
  {
    path: '/after-sales/order/askforcancel',
    component: 'order/afterSales/list'
  },
  {
    path: '/after-sales/order/askforcancel_no_dealwith',
    component: 'order/afterSales/list'
  },
  {
    path: '/after-sales/order/askforcancel_cancel_succ',
    component: 'order/afterSales/list'
  },
  {
    path: '/after-sales/order/askforcancel_cancel_fail',
    component: 'order/afterSales/list'
  },
  {
    path: '/after-sales/order/askforcancel_place_on',
    component: 'order/afterSales/list'
  },

  {
    path: '/after-sales/product',
    redirect: '/after-sales/product/goods'
  },
  // 商品列表
  {
    path: '/after-sales/product/goods',
    component: 'product/goods'
  },
  {
    path: '/after-sales/product/goods/add',
    component: 'product/originGoods',
    title: 'app.common.addGoods'
  },
  // 添加列表
  {
    path: '/after-sales/product/goods/:id',
    component: 'product/originGoods',
    title: 'app.common.editGoods'
  },

  { path: '/after-sales/product/activityManage', redirect: '/after-sales/product/activity'},
  { path: '/after-sales/product/activity', component: 'product/activity'},
  { path: '/after-sales/product/activity/add', component: 'product/originActivity', title: 'app.common.addActivityTitle' }, // 添加 折扣活动列表
  { path: '/after-sales/product/activity/:id', component: 'product/originActivity', title: 'app.common.activityTitle' }, // 编辑 折扣活动列表

  { path: '/after-sales/customer', redirect: '/after-sales/customer/list'},
  { path: '/after-sales/customer/list', component: 'customer/list'},
  { path: '/after-sales/customer/unassigned', component: 'customer/list'},
  { path: '/after-sales/customer/assigned', component: 'customer/list'},

  { path: '/after-sales/customer/clue', component: 'customer/clue'},
  { path: '/after-sales/customer/clue/:type', component: 'customer/clue'},
  {
    path: '/after-sales/customer/clue',
    component: 'customer/clue'
  },
  {
    path: '/after-sales/customer/clue/:type',
    component: 'customer/clue'
  },
  {
    path: '/after-sales/customer/origin-clue/add',
    component: 'customer/originClue',
    title: 'app.common.addClue',
    layout: { hideMenu: true },
  },
  {
    path: '/after-sales/customer/origin-clue/:id',
    component: 'customer/clueDetail',
    title: 'app.common.editClue',
    layout: { hideMenu: true },
  },

  {
    path: '/after-sales/customer/:id',
    component: 'customer/layout',
    routes: [
      {
        path: '/after-sales/customer/:id',
        redirect: '/after-sales/customer/:id/info'
      },
      {
        path: '/after-sales/customer/:id/info',
        component: 'customer/info',
        layout: { hideMenu: true },
      },
      {
        path: '/after-sales/customer/:id/order',
        component: 'customer/order',
        layout: { hideMenu: true },
      },
    ],
  },
  // 售后报表
  {
    path: '/after-sales/report',
    component: 'report/list',
    title: 'app.menu.afterSalesReportList'
  }
]
