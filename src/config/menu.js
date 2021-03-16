export default [
  {
    path: '/pre-sales',
    name: 'app.nav.preSales', // 售前管理菜单
    access: 'nav:presale',
    children: [
      {
        name: 'app.menu.dashboard', // 控制面板
        path: '/dashboard',
        icon: 'icon-dashboard',
      },
      {
        name: 'app.menu.orderManagement', //订单管理
        path: '/order',
        icon: 'icon-liebiao',
        access: 'menu:presale-order',
        children: [
          {
            name: 'app.menu.orderList', // 订单列表
            path: '/order/advertise',
            children: [
              {
                name: 'app.menu.unauditedOrders', //未审核订单列表
                path: '/order/audit_not',
                access: 'menu:presale-order-list-audit_not',
                dataKey: 'audit_no',
                dataStatus: 0
              },
              {
                name: 'app.menu.auditedOrders', //已审核订单列表
                path: '/order/audited',
                access: 'menu:presale-order-list-audited',
                dataKey: 'audit_yes',
                dataStatus: 1
              },
              {
                name: 'app.menu.undistributedOrders', //未分配订单列表
                path: '/order/distribute_not',
                access: 'menu:presale-order-list-distribute_not',
                dataKey: 'distribute_no',
                dataStatus: 0
              },
              {
                name: 'app.menu.distributedOrders', //已分配订单列表
                path: '/order/distributed',
                access: 'menu:presale-order-list-distributed',
                dataKey: 'distribute_yes',
                dataStatus: 1
              },
            ],
          },
          {
            name: 'app.menu.manualOrder', //手工下单
            path: '/order/manual',
            access: 'menu:presale-order-manual',
            dataKey: 'manul_order_num',

          },
          {
            name: 'app.menu.repeatOrders', //重复定单
            path: '/order/repeat',
            access: 'menu:presale-order-repeat',
            dataKey: 'repeat_order_num'
          },
          {
            name: 'app.menu.invalidOrders', //无效订单
            path: '/order/invalid',
            access: 'menu:presale-order-invalid',
            dataKey: 'invalid_order_num'
          },
          {
            name: 'app.menu.abnormalOrders', //异常订单
            path: '/order/abnormal',
            access: 'menu:presale-order-abnormal',
            dataKey: 'abnormal_order_num',
            children: [
              {
                name: 'app.menu.unHandleAbnormalOrders', //未处理异常订单
                path: '/order/abnormal_no_dealwith',
                access: 'menu:presale-order-abnormal-no_dealwith',
                dataKey: 'abnormal_no_dealwith',
                dataStatus: 0
              },
              {
                name: 'app.menu.handleAbnormalOrders', //已处理异常订单
                path: '/order/abnormal_dealwith',
                access: 'menu:presale-order-abnormal-dealwith',
                dataKey: 'abnormal_dealwith',
                dataStatus: 1
              },
            ],
          },
          {
            name: 'app.menu.cancelOrderApplyFor', //取消订单
            path: '/order/askforcancel',
            access: 'menu:presale-order-askforcancel',
            dataKey: 'askforcancel_total',
            children: [
              {
                name: 'app.menu.unHandleApplyFor', //待处理申请
                path: '/order/askforcancel_no_dealwith',
                access: 'menu:presale-order-askforcancel-no_dealwith',
                dataKey: 'askforcancel_no_dealwith'
              },
              {
                name: 'app.menu.cancelSuccessOrders', //取消成功订单
                path: '/order/askforcancel_cancel_succ',
                access: 'menu:presale-order-askforcancel-cancel_succ',
                dataKey: 'askforcancel_succ'
              },
              {
                name: 'app.menu.cancelFailedOrders', //取消失败订单
                path: '/order/askforcancel_cancel_fail',
                access: 'menu:presale-order-askforcancel-cancel_fail',
                dataKey: 'askforcancel_fail'
              },
              {
                name: 'app.menu.cancelOrderApplyForArchive', //取消订单申请归档
                path: '/order/askforcancel_place_on',
                access: 'menu:presale-order-askforcancel-place_on',
              },
            ],
          },
        ],
      },
      {
        name: 'app.menu.reportManagement', // 报表模块
        path: '/report',
        icon: 'icon-linechart',
        access: 'menu:presale-report',
        children: [
          {
            name: 'app.menu.reportList', // 售前报表
            path: '/report',
            access: 'menu:presale-report-list'
          },
        ],
      },
      {
        name: 'app.menu.customerManage', // 客户管理
        path: '/customer',
        icon: 'icon-contacts',
        access: 'menu:presale-customer',
        children: [
          {
            name: 'app.menu.customerList', // 客户列表
            path: '/customer/list',
            access: 'menu:presale-customer-index',
          },
        ],
      },
    ],
  },
  {
    path: '/after-sales',
    name: 'app.nav.afterSales', // 售后管理菜单
    access: 'nav:aftersale',
    children: [
      { name: 'app.menu.dashboard', path: '/dashboard', icon: 'icon-dashboard' },
      {
        name: 'app.menu.orderManagement',         // 订单管理
        path: '/order',
        icon: 'icon-paste',
        access: 'menu:aftersale-order',
        children: [
          {
            name: 'app.common.manualOrder', //手工下单
            path: '/order/manual',
            access: 'menu:aftersale-order-manual',
            dataKey: 'manual',
          },
          {
            name: 'app.common.auditOrder', //审核订单
            path: '/order/audit',
            access: 'menu:aftersale-order-audit',
            dataKey: 'audit',
            children: [
              {
                name: 'app.common.checkPending', //待审核订单
                path: '/order/audit_not',
                access: 'menu:aftersale-order-audit-audit_not',
                dataKey: 'audit_not',
                dataStatus: 0
              },
              {
                name: 'app.common.audited', //已审核订单
                path: '/order/audited',
                access: 'menu:aftersale-order-audit-audited',
                dataKey: 'audited',
                dataStatus: 1
              },
              {
                name: 'app.common.rejected', //已驳回订单
                path: '/order/reject',
                access: 'menu:aftersale-order-audit-reject',
                dataKey: 'reject',
                dataStatus: 0
              }
            ]
          },
          {
            name: 'app.menu.abnormalOrders', //异常订单
            path: '/order/abnormal',
            access: 'menu:aftersale-order-abnormal',
            dataKey: 'abnormal',
            children: [
              {
                name: 'app.menu.unHandleAbnormalOrders', //未处理订单
                path: '/order/abnormal_no_dealwith',
                access: 'menu:aftersale-order-abnormal-no_dealwith',
                dataKey: 'abnormal_no_dealwith',
                dataStatus: 0
              },
              {
                name: 'app.menu.handleAbnormalOrders', //已处理订单
                path: '/order/abnormal_dealwith',
                access: 'menu:aftersale-order-abnormal-dealwith',
                dataKey: 'abnormal_dealwith',
                dataStatus: 1
              }
            ]
          },
          {
            name: 'app.menu.cancelOrderApplyFor', // 取消订单
            path: '/order/askforcancel',
            access: 'menu:aftersale-order-askforcancel',
            dataKey: 'askforcancel',
            children: [
              {
                name: 'app.menu.unHandleApplyFor', //待处理申请
                path: '/order/askforcancel_no_dealwith',
                access: 'menu:aftersale-order',
                dataKey: 'askforcancel_no_dealwith',
                dataStatus: 0
              },
              {
                name: 'app.menu.cancelSuccessOrders', //取消成功
                path: '/order/askforcancel_cancel_succ',
                access: 'menu:aftersale-order-askforcancel-cancel_succ',
                dataKey: 'askforcancel_cancel_succ',
                dataStatus: 1
              },
              {
                name: 'app.menu.cancelFailedOrders', //取消失败
                path: '/order/askforcancel_cancel_fail',
                access: 'menu:aftersale-order-askforcancel-no_dealwith',
                dataKey: 'askforcancel_cancel_fail',
                dataStatus: 0
              },
              {
                name: 'app.menu.cancelOrderApplyForArchive', //取消归档
                access: 'menu:aftersale-order-askforcancel-place_on',
                path: '/order/askforcancel_place_on',
              }
            ]
          }
        ]
      },
      {
        name: 'app.menu.customerManage',         // 客户管理
        path: '/customer',
        icon: 'icon-contacts',
        access: 'menu:aftersale-customer',
        children: [
          {
            name: 'app.menu.customerList',
            path: '/customer/list',
            access: 'menu:aftersale-customer-list',
            dataKey: 'customer_num_total',
            dataStatus: 0,
            children: [
              {
                name: 'app.common.customer.unassigned',
                access: 'menu:aftersale-customer-list-distribute_not',
                path: '/customer/unassigned',
                dataKey: 'customer_distribute_no',
                dataStatus: 1,
              },
              {
                name: 'app.common.customer.assigned',
                access: 'menu:aftersale-customer-list-distributed',
                path: '/customer/assigned',
                dataKey: 'customer_distribute_yes',
                dataStatus: 0,
              },
            ]
          },
          {
            name: 'app.menu.clueList',
            path: '/customer/clue',
            access: 'menu:aftersale-customer-clue',
            dataKey: 'clue_num_total',
            dataStatus: 1,
            children: [
              {
                name: 'app.common.clue-unassigned',
                access: 'menu:aftersale-customer-clue-distribute_not',
                path: '/customer/clue/distribute_not',
                dataKey: 'clue_distribute_no',
                dataStatus: 0,
              },
              {
                name: 'app.common.clue-assigned',
                access: 'menu:aftersale-customer-clue-distributed',
                path: '/customer/clue/distributed',
                dataKey: 'clue_distribute_yes',
                dataStatus: 1,
              },
              {
                name: 'app.common.clue-unprocessed',
                access: 'menu:aftersale-customer-clue-no_dealwith',
                path: '/customer/clue/no_dealwith',
                dataKey: 'clue_no_dealwith',
                dataStatus: 0,
              },
              {
                name: 'app.common.clue-processed',
                access: 'menu:aftersale-customer-clue-dealwith',
                path: '/customer/clue/dealwith',
                dataKey: 'clue_dealwith',
                dataStatus: 1,
              },
              {
                name: 'app.common.clue-storage',
                access: 'menu:aftersale-customer-clue-finished',
                path: '/customer/clue/finished',
              },
            ]
          },
        ]
      },
      {
        name: 'app.common.productManage',
        path: '/product',
        icon: 'icon-shopping',
        access: 'menu:aftersale-goods',
        children: [
          {
            name: 'app.menu.goodsList',
            path: '/product/goods',
            access: 'menu:aftersale-goods-list',
          },
          {
            name: 'app.menu.activityManage',
            path: '/product/activityManage',
            access: 'menu:aftersale-goods-promotions',
            children: [
              {
                name: 'app.menu.activityList',
                path: '/product/activity',
                access: 'menu:aftersale-goods-promotions-index',
              }
            ]
          },
        ]
      },
      {
        name: 'app.menu.reportManage', // 报表模块
        path: '/report',
        icon: 'icon-linechart',
        access: 'menu:aftersale-report',
        children: [
          {
            name: 'app.menu.afterSalesReportList', // 售后报表
            access: 'menu:aftersale-report-list',
            path: '/report',
          },
        ],
      },
    ],
  },
  {
    path: '/system',
    name: 'app.nav.system', // 系统管理,
    title: 'app.menu.system.title',
    access: 'nav:system',
    children: [
      {
        name: 'app.nav.system', // 系统管理,
        icon: 'icon-setting',
        path: '/system',
        children: [
          { name: 'app.menu.system.branch', path: '/system/branch', access: 'menu:system-department', }, // 部门管理
          { name: 'app.menu.system.staff', path: '/system/staff', access: 'menu:system-user' }, //员工管理
          { name: 'app.menu.system.role', path: '/system/role', access: 'menu:system-role' }, //员工管理
        ]
      }
    ],
  },
];
