import { Link, history } from 'umi'
import { basic, store, numeral } from '@/utils'

export default [
  // 订单号
  {
    title: 'app.common.orderNo',
    dataIndex: 'order_no',
    width: 180,
    fixed: 'left',
    render: (v, { id }) => {
      let path
      if(history.location.pathname.includes('after-sales')) {
        path = `/after-sales/order/${id}/detail`
      } else if (history.location.pathname.includes('pre-sales')) {
        path = `/pre-sales/order/${id}/detail`
      } else if (store.get('account').job_type === 2) {
        path = `/after-sales/order/${id}/detail`
      } else {
        path = `/pre-sales/order/${id}/detail`
      }
      return <Link to={path}>{v}</Link>
    },
    rules: [
      'default',
      'customer_order',
      'staff_order',
    ]
  },
  // 客户名称
  {
    title: 'app.common.customerName',
    dataIndex: 'customer_name',
    width: 162,
    rules: [
      'default',
      'staff_order',
    ]
  },
  //国家
  {
    title: 'app.common.country',
    dataIndex: 'country_name',
    width: 100,
    rules: [
      'default',
    ]
  },
  // 语言
  {
    title: 'app.common.language',
    dataIndex: 'language_name',
    width: 100,
    rules: [
      'default',
    ]
  },
  // 电话号码
  {
    title: 'app.common.phone',
    dataIndex: 'tel',
    width: 160,
    render: v => basic.getSecretTelNum(v),
    rules: [
      'default',
      'staff_order',
    ],
  },
  // 商品名称
  {
    title: 'app.common.goodsName',
    dataIndex: 'goods_info',
    width: 160,
    className: 'data-element',
    render: v => Array.isArray(v) && v.length ? v.map(item => <span key={item.id}>{item.internal_name}</span>) : '-',
    rules: [
      'default',
      'customer_order',
      'staff_order',
    ],
  },
  // 数量
  {
    title: 'app.common.number',
    dataIndex: 'goods_info',
    width: 60,
    render: v => Array.isArray(v) && v.length ? v.reduce((pre, next) => pre + next.num, 0) : '-',
    rules: [
      'default',
      'customer_order',
      'staff_order',
    ],
  },
  // 金额
  {
    title: 'app.common.amount',
    dataIndex: 'sale_amount',
    width: 100,
    render: v => numeral(v).format('0,0.00'),
    rules: [
      'staff_order',
    ],
  },
  // 商品总金额
  {
    title: 'app.common.goodsAmount',
    dataIndex: 'sale_amount',
    width: 100,
    render: v => numeral(v).format('0,0.00'),
    rules: [
      'default',
    ],
  },
  // 优惠金额
  {
    title: 'app.common.discountAmount',
    dataIndex: 'discount_amount',
    width: 100,
    align: 'center',
    render: v => numeral(v).format('0,0.00'),
    rules: [
      'default',
    ]
  },
  // 预付金额
  {
    title: 'app.common.advancedAmount',
    dataIndex: 'received_amount',
    width: 100,
    align: 'center',
    render: v => numeral(v).format('0,0.00'),
    rules: [
      'default',
    ]
  },
  // 订单总金额
  {
    title: 'app.common.orderTotalAmount',
    dataIndex: 'order_amount',
    width: 100,
    render: v => numeral(v).format('0,0.00'),
    rules: [
      'default',
      'customer_order',
    ]
  },
  //下单类型
  {
    title: 'app.common.underOrderType',
    dataIndex: 'order_type',
    width: 100,
    align: 'center',
    render: v => basic.formatDDIC(`order.order_type.${v}`, '-'),
    rules: [
      'default',
      'customer_order',
      'staff_order',
    ]
  },
  // 订单类型
  {
    title: 'app.common.orderType',
    dataIndex: 'order_type',
    width: 100,
    align: 'center',
    render: v => basic.formatDDIC(`order.order_type.${v}`, '-'),
    rules: [
      'default',
    ]
  },
  // 短信验证
  {
    title: 'app.common.messageStatus',
    dataIndex: 'sms_verify_status',
    width: 80,
    render: v => basic.formatDDIC(`order.sms_verify_status.${v}`, '-'),
    rules: [
      'default',
      'customer_order',
    ]
  },
  // 审核状态
  {
    title: 'app.common.auditStatus',
    dataIndex: 'audit_status',
    width: 80,
    render: v => basic.formatDDIC(`order.audit_status.${v}`, '-'),
    rules: [
      'default',
    ],
  },
  // 订单状态
  {
    title: 'app.common.orderStatus',
    dataIndex: 'order_status',
    width: 110,
    align: 'center',
    render: v => basic.formatDDIC(`order.order_status.${v}`, '-'),
    rules: [
      'customer_order',
      'staff_order',
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
      'customer_order',
      'staff_order',
    ]
  },
  // 邮编
  {
    title: 'app.common.zipCode',
    dataIndex: '',
    width: 100,
    rules: [
      'default'
    ],
  },
  // 地址
  {
    title: 'app.common.address',
    dataIndex: '',
    width: 100,
    rules: ['repeat', 'invalid'],
  },
  // 留言
  {
    title: 'app.common.leaveWord',
    dataIndex: '',
    width: 100,
    rules: ['repeat', 'invalid'],
  },
  // 订单时间
  {
    title: 'app.common.orderDate',
    dataIndex: 'order_time',
    width: 200,
    align: 'center',
    rules: [
      'default',
      'customer_order',
      'staff_order',
    ]
  },
  // 分配状态
  {
    title: 'app.common.distributionStatus',
    dataIndex: 'distribute_status',
    width: 100,
    align: 'center',
    render: v => basic.formatDDIC(`order.distribute_status.${v}`, '-'),
    rules: ['default'],
  },
  // 售前客服
  {
    title: 'app.common.preSaleService',
    dataIndex: ['pre_sale', 'real_name'],
    width: 100,
    align: 'center',
    rules: [
      'default',
    ]
  },
  // 售后客服
  {
    title: 'app.common.afterSaleService',
    dataIndex: ['after_sale', 'real_name'],
    width: 120,
    align: 'center',
    render: v => v || '-',
    rules: [
      'default',
    ]
  },
  // 售前处理
  {
    title: 'app.common.preSaleHandle',
    dataIndex: 'pre_opt_type',
    width: 128,
    align: 'center',
    render: v => basic.formatDDIC(`order.pre_opt_type.${v}`, '-'),
    rules: [
      'default',
      'customer_order',
      'staff_order',
    ]
  },
  // 最后处理时间
  {
    title: 'app.common.lastDisposeTime',
    dataIndex: 'pre_opt_time',
    width: 100,
    align: 'center',
    render: v => v,
    rules: [
      'pre-sales-report',
    ]
  },
  // 售前部门
  {
    title: 'app.common.preBranch',
    dataIndex: 'department_name',
    width: 100,
    align: 'center',
    render: v => v,
    rules: [
      'pre-sales-report',
    ]
  },
  // 售前人员
  {
    title: 'app.common.preStaff',
    dataIndex: 'pre_sale_name',
    width: 100,
    align: 'center',
    render: v => v,
    rules: [
      'pre-sales-report',
    ]
  },
  // 呼出次数
  {
    title: 'app.common.callNumber',
    dataIndex: 'call_num',
    width: 100,
    align: 'center',
    render: v => v,
    rules: [
      'pre-sales-report',
    ]
  },
  // 最近呼出时间
  {
    title: 'app.common.lastCallTime',
    dataIndex: 'call_time',
    width: 100,
    align: 'center',
    render: v => v,
    rules: [
      'pre-sales-report',
    ]
  },
  // 最近呼出时长
  {
    title: 'app.common.lastCallTimeLength',
    dataIndex: 'call_duration',
    width: 100,
    align: 'center',
    render: v => v,
    rules: [
      'pre-sales-report',
    ]
  },
  // 售前审核
  {
    title: 'app.common.preAuditStatus',
    dataIndex: 'audit_status',
    width: 100,
    align: 'center',
    render: v => basic.formatDDIC(`order.audit_status.${v}`, '-'),
    rules: [
      'default',
    ]
  },
  // 售后审核
  {
    title: 'app.common.afterSaleAudit',
    dataIndex: 'audit_status',
    width: 100,
    align: 'center',
    render: v => basic.formatDDIC(`order.audit_status.${v}`, '-'),
    rules: [
      'default',
      'customer_order',
      'staff_order',
    ]
  },
  // 异常处理
  {
    title: 'app.common.abnormalStatus',
    dataIndex: 'status',
    width: 100,
    align: 'center',
    render: v => basic.formatDDIC(`order.status_abnormal.${v}`, '-'),
    rules: [
      'abnormal',
      'abnormal_no_dealwith'
    ]
  }
];

