import { basic, numeral } from '@/utils';
const { formatDDIC } = basic

export default [
  {
    title: 'app.common.orderNo',
    dataIndex: 'order_no',
    align: 'center',
    fixed: 'left',
    width: 200,
    rules: [
      'pre-report',
      'after-report',
    ],
  },
  {
    width: 200,
    align: 'center',
    title: 'app.common.orderDate',
    dataIndex: 'order_time',
    render: v => v || '-',
    rules: [
      'pre-report',
      'after-report',
    ],
  },
  {
    width: 200,
    align: 'center',
    title: 'app.common.customerName',
    dataIndex: 'customer_name',
    render: v => v || '-',
    rules: [
      'pre-report',
      'after-report',
    ],
  },
  {
    width: 200,
    align: 'center',
    title: 'app.common.phoneNumber',
    dataIndex: 'tel',
    render: v => basic.getSecretTelNum(v),
    rules: [
      'pre-report',
      'after-report',
    ],
  },
  {
    width: 240,
    align: 'center',
    title: 'app.common.goodsName',
    dataIndex: 'goods_info',
    render: v => Array.isArray(v) ? v.map(item => <div key={item.id}>{item.internal_name}</div>) : '-',
    rules: [
      'pre-report',
      'after-report',
    ],
  },
  {
    width: 240,
    align: 'center',
    title: 'app.common.sku',
    dataIndex: 'goods_info',
    render: v => Array.isArray(v) ? v.map(item => <div key={item.id}>{item.sku}</div>) : '-',
    rules: [
      'pre-report',
      'after-report',
    ],
  },
  {
    width: 120,
    align: 'center',
    title: 'app.common.number',
    dataIndex: 'goods_info',
    render: v => Array.isArray(v) ? v.reduce((pre, next) => pre + next.num, 0) : '-',
    rules: [
      'pre-report',
      'after-report',
    ],
  },
  {
    width: 130,
    align: 'center',
    title: 'app.common.goodsAmount',
    dataIndex: 'sale_amount',
    render: v => numeral(v).format('0,0.00'),
    rules: [
      'pre-report',
      'after-report',
    ],
  },
  {
    width: 130,
    align: 'center',
    title: 'app.common.discountAmount',
    dataIndex: 'discount_amount',
    render: v => numeral(v).format('0,0.00'),
    rules: [
      'pre-report',
      'after-report',
    ],
  },
  {
    width: 130,
    align: 'center',
    title: 'app.common.premiumAmount',
    dataIndex: 'premium_amount',
    render: v => numeral(v).format('0,0.00'),
    rules: [
      'pre-report',
      'after-report',
    ],
  },
  {
    width: 130,
    align: 'center',
    title: 'app.common.receivableAmount',
    dataIndex: 'collect_amount',
    render: v => numeral(v).format('0,0.00'),
    rules: [
      'pre-report',
      'after-report',
    ],
  },
  {
    width: 130,
    align: 'center',
    title: 'app.common.advancedAmount',
    dataIndex: 'received_amount',
    render: v => numeral(v).format('0,0.00'),
    rules: [
      'pre-report',
      'after-report',
    ],
  },
  // 订单总金额
  {
    width: 130,
    align: 'center',
    title: 'app.common.orderTotalAmount',
    dataIndex: 'order_amount',
    render: v => numeral(v).format('0,0.00'),
    rules: [
      'pre-report',
      'after-report',
    ],
  },
  // 备注内容
  {
    width: 200,
    title: 'app.common.remarkContent',
    dataIndex: 'customer_remark',
    render: v => v || '-',
    rules: [
      'pre-report',
    ],
  },
  {
    width: 130,
    align: 'center',
    title: 'app.common.country',
    dataIndex: 'country_name',
    render: v => v || '-',
    rules: [
      'pre-report',
      'after-report',
    ],
  },
  {
    width: 130,
    align: 'center',
    title: 'app.common.language',
    dataIndex: 'language_name',
    render: v => v || '-',
    rules: [
      'pre-report',
    ],
  },
  {
    width: 100,
    align: 'center',
    title: 'app.common.messageStatus',
    dataIndex: 'sms_verify_status',
    render: v => formatDDIC(`order.sms_verify_status.${v}`, '-'),
    rules: [
      'pre-report',
    ],
  },
  {
    width: 100,
    title: 'app.common.logisticsStatus',
    dataIndex: 'shipping_status',
    align: 'center',
    render: v => formatDDIC(`order.shipping_status.${v}`, '-'),
    rules: [
      'pre-report',
      'after-report',
    ],
  },
  // 分配时间
  {
    width: 200,
    title: 'app.common.distributeTime',
    dataIndex: 'distribute_time',
    align: 'center',
    render: v => v || '-',
    rules: [
      'pre-report',
    ],
  },
  {
    width: 130,
    title: 'app.common.preSaleHandle',
    dataIndex: 'pre_opt_type',
    align: 'center',
    render: v => formatDDIC(`order.pre_opt_type.${v}`, '-'),
    rules: [
      'pre-report',
    ],
  },
  {
    width: 200,
    title: 'app.common.lastDisposeTime',
    dataIndex: 'pre_opt_time',
    align: 'center',
    render: v => v || '-',
    rules: [
      'pre-report',
    ],
  },
  {
    width: 150,
    title: 'app.common.preBranch',
    dataIndex: 'department_name',
    align: 'center',
    render: v => v || '-',
    rules: [
      'pre-report',
    ],
  },
  {
    width: 150,
    title: 'app.common.preStaff',
    dataIndex: 'pre_sale_name',
    align: 'center',
    render: v => v || '-',
    rules: [
      'pre-report',
    ],
  },
  {
    width: 100,
    title: 'app.common.callNumber',
    dataIndex: 'call_num',
    align: 'center',
    render: v => String(v) || '-',
    rules: [
      'pre-report',
    ],
  },
  {
    width: 200,
    title: 'app.common.lastCallTime',
    dataIndex: 'call_time',
    align: 'center',
    render: v => v || '-',
    rules: [
      'pre-report',
    ],
  },
  {
    width: 120,
    title: 'app.common.lastCallTimeLength',
    dataIndex: 'call_duration',
    align: 'center',
    render: v => String(v) || '-',
    rules: [
      'pre-report',
    ],
  },
  {
    width: 130,
    align: 'center',
    title: 'app.common.orderStatus',
    dataIndex: 'order_status',
    render: v => formatDDIC(`order.order_status.${v}`, '-'),
    rules: [
      'after-report',
      'pre-report',
    ],
  },
  {
    width: 140,
    title: 'app.common.afterBranch',
    dataIndex: 'department_name',
    align: 'center',
    render: v => v || '-',
    rules: [
      'after-report',
    ],
  },
  // 售后人员
  {
    width: 160,
    title: 'app.common.afterStaff',
    dataIndex: 'after_sale_name',
    align: 'center',
    render: v => v || '-',
    rules: [
      'after-report',
    ],
  },
  {
    width: 120,
    title: 'app.common.afterSaleAudit',
    dataIndex: 'audit_status',
    align: 'center',
    render: v => formatDDIC(`order.audit_status.${v}`, '-'),
    rules: [
      'after-report',
    ],
  },
  // 订单审核时间
  {
    width: 200,
    title: 'app.common.orderCheckDate',
    dataIndex: 'audit_time',
    align: 'center',
    render: v => v,
    rules: [
      'after-report',
    ],
  },
  // 订单类型-售后
  {
    width: 160,
    title: 'app.common.orderType',
    dataIndex: 'order_second_type',
    align: 'center',
    render: v => formatDDIC(`order.order_second_type.${v}`, '-'),
    rules: [
      'after-report',
    ],
  },
  // 订单类型-售前
  {
    width: 160,
    title: 'app.common.orderType',
    dataIndex: 'order_type',
    align: 'center',
    render: v => formatDDIC(`order.order_type.${v}`, '-'),
    rules: [
      'pre-report',
    ],
  },
]
