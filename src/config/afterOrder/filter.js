import { basic } from '@/utils'
export default [
  {
    id: 'order_no',
    label: 'app.common.orderNo', // 订单编号
    type: 'input',
    rules: [
      'manual',
      'audit',
      'audit_not',
      'audited',
      'reject',
      'abnormal',
      'abnormal_no_dealwith',
      'abnormal_dealwith',
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
      'askforcancel_place_on'
    ]
  },
  {
    id: 'tel',
    label: 'app.common.phoneNumber', //电话号码
    type: 'input',
    rules: [
      'manual',
      'audit',
      'audit_not',
      'audited',
      'reject',
      'abnormal',
      'abnormal_no_dealwith',
      'abnormal_dealwith',
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
      'askforcancel_place_on'
    ]
  },
  {
    id: 'customer_name',
    label: 'app.common.customerName', // 客户名称
    type: 'input',
    rules: [
      'manual',
      'audit',
      'audit_not',
      'audited',
      'reject',
      'abnormal',
      'abnormal_no_dealwith',
      'abnormal_dealwith',
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
      'askforcancel_place_on'
    ]
  },
  {
    id: 'audit_status',
    label: 'app.common.afterSaleAudit', // 售后审核
    type: 'select',
    options: basic.formatDDIC('order.audit_status', true),
    rules: [
      'manual',
      'audit',
      'audit_not',
      'audited',
      'reject',
    ]
  },
  {
    id: 'source_order_no',
    label: 'app.common.originalOrderNo', // 原订单
    type: 'input',
    rules: [
      'manual'
    ]
  },
  {
    id: 'order_second_type',
    label: 'app.common.orderType', // 订单类型
    type: 'select',
    options: basic.formatDDIC('order.order_second_type', true),
    rules: [
      'manual'
    ]
  },
];
