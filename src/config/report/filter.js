import { basic } from '@/utils';
const { formatDDIC } = basic

export default [
  {
    id: 'report_pre_opt_type',
    label: 'app.common.preSaleHandle',
    type: 'select',
    options: formatDDIC("order.report_pre_opt_type", true),
    placeholder: 'app.common.placeholder.allStatus',
    rules: [
      'pre-report',
    ],
  },
  {
    id: 'audit_status',
    label: 'app.common.afterSaleAudit',
    type: 'select',
    options: formatDDIC("order.audit_status", true),
    placeholder: 'app.common.placeholder.allStatus',
    rules: [
      'after-report',
    ],
  },
  {
    id: 'shipping_status',
    label: 'app.common.logisticsStatus',
    type: 'select',
    options: formatDDIC("order.shipping_status", true),
    placeholder: 'app.common.placeholder.allStatus',
    rules: [
      'pre-report',
      'after-report',
    ],
  },
  {
    id: 'country_id',
    label: 'app.common.country',
    type: 'select',
    options: [],
    placeholder: 'app.common.placeholder.allCountry',
    optionsMap: {
      label: 'cn_name',
      value: 'id'
    },
    rules: [
      ['pre-report', (item, data) => ({ ...item, options: data.country })],
      ['after-report', (item, data) => ({ ...item, options: data.country })],
    ],
  },
  {
    id: 'language_id',
    label: 'app.common.language',
    type: 'select',
    options: [],
    placeholder: 'app.common.placeholder.allLang',
    optionsMap: {
      label: 'name',
      value: 'id'
    },
    rules: [
      ['pre-report', (item, data) => ({ ...item, options: data.language })]
    ],
  },
  {
    id: 'call_status',
    label: 'app.common.callOutStatus',
    type: 'select',
    options: formatDDIC("order.call_status", true),
    placeholder: 'app.common.placeholder.allStatus',
    rules: [
      'pre-report',
    ],
  },
  {
    id: 'pre_opt_time',
    label: 'app.common.lastDisposeTime',
    type: 'datePicker',
    rules: [
      'pre-report',
    ],
  },
  {
    id: 'distribute_time',
    label: 'app.common.distributeTime',
    type: 'datePicker',
    rules: [
      'pre-report',
    ],
  },
  {
    id: 'audit_time',
    label: 'app.common.orderCheckDate',
    type: 'datePicker',
    rules: [
      'after-report',
    ],
  },
  // 订单类型
  {
    id: 'order_second_type',
    label: 'app.common.orderType',
    type: 'select',
    placeholder: 'app.common.allType',
    options: formatDDIC("order.order_second_type", true),
    rules: [
      'after-report',
    ]
  }
]
