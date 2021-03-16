export default {
  globalMap: '/fieldmap',
  globalPermission: '/sys_privilege',
  accountLogin: 'POST /user/login',
  queryLangs: 'GET /language',
  queryCountry: 'GET /country',
  queryProvince: 'GET /area/state',
  queryCity: 'GET /area/city',
  queryDistrict: 'GET /area/district',
  queryZipCode: 'GET /area/post_code',
  makeCall: 'GET /call',                            // 拨打电话 参数tel
  queryCode: 'GET /getverifycode',
  langList: 'GET /language',
  promotionList: 'GET /promotions',
  promotionAble: 'GET /promotions_able',
  receiveOrder: 'PUT /user/receive_order',
  myStaff: 'GET /user/my/',
  afterStaff: 'GET /user/my_member',
  branchList: 'GET /department',
  branchListAble: 'GET /department_able',
  branchSingle: 'GET /department/:id',
  branchCreate: 'POST /department',
  branchUpdate: 'PUT /department/:id',
  branchDelete: 'DELETE /department/:id',
  branchCountryRate: '/department_weight/get_rate',

  staffList: 'GET /user',
  staffSingle: 'GET /user/:id',
  staffCreate: 'POST /user',
  staffUpdate: 'PUT /user/:id',
  staffDelete: 'DELETE /user/:id',
  staffCustomer: '/user_customer',
  staffOrder: '/user_order',
  staffOrderTransfer: 'POST /user_order',
  staffCustomerTransfer: 'POST /user_customer',
  staffModify: 'PUT /user/setpassword',
  roleList: 'GET /role',
  roleListAble: 'GET /role_able',
  roleCreate: 'POST /role',
  roleUpdate: 'PUT /role/:id',
  roleSingle: 'GET /role/:id',
  roleDelete: 'DELETE /role/:id',

  selectGoods: 'GET /goods_sku', // 获取商品: 'GET /goods/order/manual', // 获取商品

  customerAddressDetail: 'GET /customer_address/:id', // 客户地址详情
  orderRecord: 'GET /order/opt_record/:id',
  preSalesReport: 'GET /order/report',
  preSalesReportDownLoad: 'GET /order/report/export',
  preSalesStaffs: 'GET /user/my',

  preSalesShipping: 'GET /order/abnormal/shipping/:id',
  preDashboard: 'GET /main/panel',
  preSalesCreate: 'POST /order/:apiType?', //创建手工单
  preSalesOrderList: 'GET /order/:apiType?', // 订单列表统一查询接口
  preSalesOrderDetail: 'GET /order/:apiType?/:id', // 订单统一详情接口
  preSalesRecord: 'GET /order/opt_record/:id', // 订单记录查询接口
  preSalesOrderUpdate: 'PUT /order/:apiType?/:id',  // 订单修改(统一接口)
  preSalesOrderArchive: 'PUT /order/askforcancel/archive', // 订单归档
  preOrderDistribute: 'PUT /order/distribute', // 订单分配
  preStartDistribute: 'POST /manager/start_distribute',   // 开始分单操作

  preOrderRepeatSet: 'PUT /order/repeat_setting',
  afterSalesOrderReport: 'GET /aftersale/order/report', // 售后订单报表
  afterSalesOrderReportExport: 'GET /aftersale/order/report/export', // 售后订单报表导出

  afterDashboard: '/aftersale/main/panel',
  afterSalesOrderList: 'GET /aftersale/:apiType?/order', // 售后订单列表
  afterSalesOrderCreate: 'POST /aftersale/:apiType?/order', // 售后订单统一创建
  afterSalesOrderDetail: 'GET /aftersale/:apiType?/order/:id', //统一售后订单详情
  afterSalesOrderUpdate: 'PUT /aftersale/:apiType?/order/:id', // 统一订单修改更新
  afterSalesOrderArchive: 'PUT /aftersale/askforcancel/archive', // 订单归档
  afterSalesOrderAudit: 'PUT /aftersale/charge/audit',


  pre: {
    customerAddress: 'GET /customer_address',
    queryDashboard: '/main/panel',
    querySericeCustomer: '/user/order/manual',

    orderDistribute: 'POST /order/distribute/',
    orderRecord: 'GET /order/opt_record/:id',
    orderList: 'GET /order/(type)',
    orderDetail: 'GET /order/:id',
    orderUpdate: 'PUT /order/:id/:_type',
    orderArchiveFile: 'POST /order/askforcancel/place_on',  // 归档
    orderReplenishModify: 'PUT /order/replenish/:id', // 补发订单
    orderRedeliveryModify: 'PUT /order/redelivery/:id', // 重发订单
    orderReplenishView: 'GET /order/replenish/:id', // 补发订单
    orderRedeliveryView: 'GET /order/redelivery/:id', // 重发订单
    orderAskforcancelView: 'GET /order/askforcancel/:id', // 取消申请订单详情
    orderAskforcancelModify: 'PUT /order/askforcancel/:id', // 取消申请订单 保存 提交
    orderAbnormalRedelivery: 'GET /order/abnormal_redelivery_able/',            // 异常重发订单 可选列表
    orderAbnormalRedeliveryDetailSelect: 'GET /order/abnormal_redelivery_able/:id',   // 异常重发订单 可选订单详情
    orderAbnormalRedeliverySend: 'POST /order/abnormal_redelivery_able/',       // 异常重发订单 重发操作
    orderAbnormalRedeliveryDetail: 'GET /order/abnormal_redelivery/:id',        // 异常重发订单 重发订单详情

    orderAskforcancelAll: "GET /order/askforcancel/optional_order",  // 添加取消订单时的正常订单列表

    customerList: '/customer',
    customerDetails: '/customer/:id',
    customerAddressId: '/customer_address/customer/:id/:state',
    customerRemarkList: '/customer_remark',
    customerRemarkAdd: 'POST /customer_remark',
    customerRemarkEdit: 'PUT /customer_remark/:id',
    customerOrderList: '/order/customer/:id',
  },

  after: {
    customerList: '/aftersale/customer',
    customerDistributed: '/aftersale/customer_distributed',
    customerNotDistributed: '/aftersale/customer_distribute_not',
    customerTransferTo: 'POST /aftersale/customer_distribute',
    customerStepDistribute: 'POST /aftersale/customer_step_distribute',
  },

  // 活动相关的接口
  activityList: '/promotions',
  activityAdd: 'POST /promotions',
  activityDel: 'DELETE /promotions/:id',
  activityQuery: 'GET /promotions/:id',
  activityEdit: 'PUT /promotions/:id',

  // 商品相关的接口
  goodsList: '/goods',
  goodsPullProduct: '/goods/erp_product/:id',

  goodsDetail: '/goods/:id',
  goodsAdd: 'POST /goods',
  goodsEdit: 'PUT /goods/:id',
  goodsDelete: 'DELETE /goods/:id',

  // 线索相关
  clueList: '/aftersale/customer_clue/:type?',
  clueListAble: 'GET /aftersale/customer_clue_able',

  clueAdd: 'POST /aftersale/customer_clue',
  clueEdit: 'PUT /aftersale/customer_clue/:id',
  clueDetail: 'GET /aftersale/customer_clue/:id',
  clueAddTrack: 'POST /aftersale/customer_clue_track',
  clueTrackList: 'GET /aftersale/customer_clue_track/:id',
  clueDistribute: 'POST /aftersale/customer_clue/distribute',

  clueOrderDetail: 'GET /aftersale/clue/order/:id',

  // 标签
  customerTags: '/customer_label',
  customerTagsEdit: 'POST /customer_label',

};
