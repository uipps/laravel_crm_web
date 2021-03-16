import { basic } from '@/utils'
export default [
  {
    id: 'order_no',
    label: 'app.common.orderNo', // 订单编号
    type: 'input',
    rules: [
      'advertise',
      'manual',
      'audit',
      'audit_not',
      'audited',
      'distribute_not',
      'distributed',
      'repeat',
      'invalid',
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
      'advertise',
      'manual',
      'audit',
      'audit_not',
      'audited',
      'distribute_not',
      'distributed',
      'repeat',
      'invalid',
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
      'advertise',
      'manual',
      'audit',
      'audit_not',
      'audited',
      'distribute_not',
      'distributed',
      'repeat',
      'invalid',
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
  {
    id: 'order_time',
    label: 'app.common.orderDate', // 订单时间
    type: 'datePicker',
    rules: [
      'advertise'
    ]
  },
  {
    id: 'pre_opt_type',
    label: 'app.common.preSaleHandle', // 售前处理
    type: 'select',
    options: basic.formatDDIC('order.order_pre_opt_type', true),
    rules: [
      'advertise',
      'audit_not'
    ]
  },
];
