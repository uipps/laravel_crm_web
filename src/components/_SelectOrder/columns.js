import { Link } from 'umi'
import { basic, numeral } from '@/utils'
const columns = [
  // 订单号
  {
    title: 'app.common.orderNo',
    dataIndex: 'order_no',
    width: 180,
    align: 'center',
    fixed: 'left',
    rules: [
      'replenish',
      'redelivery',
      'replenish_able', // 补发
      'redelivery_able', // 重发
      'abnormal_redelivery_able',
      'askforcancel_able',
    ]
  },
  // 客户名称
  {
    title: 'app.common.customerName',
    dataIndex: 'customer_name',
    width: 162,
    rules: [
      'replenish',
      'redelivery',
      'replenish_able',
      'redelivery_able',
      'abnormal_redelivery_able',
      'askforcancel_able',
    ]
  },
  // 商品名称
  {
    title: 'app.common.goodsName',
    dataIndex: 'goods_info',
    width: 160,
    className: 'data-element',
    align: 'center',
    render: v => Array.isArray(v) && v.length ? v.map(item => <span key={item.id}>{item.internal_name}</span>) : '-',
    rules: [
      'replenish',
      'redelivery',
      'replenish_able',
      'redelivery_able',
      'abnormal_redelivery_able',
      'askforcancel_able',
    ],
  },
  // 数量
  {
    title: 'app.common.number',
    dataIndex: 'goods_info',
    width: 100,
    align: 'center',
    render: v => Array.isArray(v) && v.length ? v.reduce((pre, next) => pre + next.num, 0) : '-',
    rules: [
      'replenish',
      'redelivery',
      'replenish_able',
      'redelivery_able',
      'abnormal_redelivery_able',
      'askforcancel_able'
    ],
  },
  // 订单总金额
  {
    title: 'app.common.orderTotalAmount',
    dataIndex: 'order_amount',
    width: 100,
    render: v => numeral(v).format('0,0.00'),
    rules: [
      'replenish',
      'redelivery',
      'replenish_able',
      'redelivery_able',
      'abnormal_redelivery_able',
      'askforcancel_able',
    ]
  },
  // 订单状态
  {
    title: 'app.common.orderStatus',
    dataIndex: 'order_status',
    width: 110,
    align: 'center',
    render: v => basic.formatDDIC(`order.order_status.${v}`, '-'),
    rules: [
      'replenish',
      'redelivery',
      'replenish_able',
      'redelivery_able',
      'abnormal_redelivery_able',
      'askforcancel_able'
    ]
  },
  // 物流状态
  {
    title: 'app.common.logisticsStatus',
    dataIndex: 'shipping_status',
    width: 140,
    align: 'center',
    render: v => basic.formatDDIC(`order.shipping_status.${v}`, '-'),
    rules: [
      'replenish',
      'redelivery',
      'replenish_able',
      'redelivery_able',
      'abnormal_redelivery_able',
      'askforcancel_able',
    ]
  },
  // 订单时间
  {
    title: 'app.common.orderDate',
    dataIndex: 'order_time',
    width: 200,
    align: 'center',
    rules: [
      'askforcancel_able'
    ]
  },
];

export default { columns }
