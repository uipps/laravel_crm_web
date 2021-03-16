import { Link } from 'umi'
import { IconFont } from '@/components'
import { basic, pathCompile, numeral } from '@/utils'
import { EditOutlined } from '@ant-design/icons'

const MANUAL_TYPE = {
  2: 'replenish',
  3: 'redelivery',
  4: 'clue',
  5: 'abnormal_redelivery'
}

const toPath = pathCompile('/after-sales/order/:id/detail/:apiType?')

export default [
  // 订单号
  {
    title: 'app.common.orderNo',
    dataIndex: 'order_no',
    width: 200,
    fixed: 'left',
    render: (v, { id }) => <Link to={toPath({ id })}>{v}</Link>,
    rules: [
      'default',
      'replenish_able', // 补发
      'redelivery_able', // 重发
      'askforcancel_able',
      [
        'manual',
        (v, { id, status_manual, order_second_type }) => {
          if(status_manual === 0){
            let href = `/after-sales/order/create/general?id=${id}`
            if ([2, 3].includes(order_second_type)) {
              href = `/after-sales/order/${id}/edit/${MANUAL_TYPE[order_second_type]}`
            }
            if(order_second_type === 4){
              href = `/after-sales/order/create/${MANUAL_TYPE[order_second_type]}?id=${id}`
            }
            return (
              <Link to={href}>
                {v} 
                {<EditOutlined style={{marginLeft: 10, color: '#9CCC65', fontSize: 16}}/>}
              </Link>
            )
          }

          return (
            <Link to={toPath({ id, apiType: MANUAL_TYPE[order_second_type] || 'manual' })}>
              {v}
            </Link>
          )
        }
      ],
      [
        'audit',
        (v, { id }) => <Link to={toPath({ id, apiType: 'audit' })}>{v}</Link>
      ],
      [
        'audited',
        (v, { id }) => <Link to={toPath({ id, apiType: 'audit' })}>{v}</Link>
      ],
      [
        'audit_not',
        (v, { id }) => <Link to={toPath({ id, apiType: 'audit' }) + '?action=audit'}>{v}</Link>
      ],
      [
        'reject',
        (v, { id, audit_status }, idx, { account }) => {
          if(audit_status !== 1 && account.level !== 1) {
            return (
              // <Link to={`/after-sales/order/create/general?id=${id}`}>{v}</Link>
              <Link to={`/after-sales/order/${id}/edit/reject`}>{v}</Link>
            )
          }

          return (
            <Link to={toPath({ id, apiType: 'audit' })}>{v}</Link>
          )
        }
      ],
      [
        'abnormal',
        (v, { id }) => <Link to={toPath({ id, apiType: 'abnormal' })}>{v}</Link>
      ],
      [
        'abnormal_dealwith',
        (v, { id }) => <Link to={toPath({ id, apiType: 'abnormal' })}>{v}</Link>
      ],
      [
        'abnormal_no_dealwith',
        (v, { id }) => <Link to={toPath({ id, apiType: 'abnormal' }) + '?action=abnormal'}>{v}</Link>
      ],
      [
        'askforcancel',
        (v, { id, status_cancel }) => {
          if (status_cancel === 0) {
            return <Link to={`/after-sales/order/${id}/edit/askforcancel`}>{v}</Link>
          }
          return <Link to={toPath({ id, apiType: 'askforcancel' })}>{v}</Link>
        }
      ],
      [
        'askforcancel_no_dealwith',
        (v, { id }) => <Link to={toPath({ id, apiType: 'askforcancel' })}>{v}</Link>
      ],
      [
        'askforcancel_cancel_succ',
        (v, { id }) => <Link to={toPath({ id, apiType: 'askforcancel' })}>{v}</Link>
      ],
      [
        'askforcancel_cancel_fail',
        (v, { id }) => <Link to={toPath({ id, apiType: 'askforcancel' })}>{v}</Link>
      ],
      'askforcancel_place_on',
    ]
  },
  // 取消状态
  {
    title: 'app.common.cancelStatus',
    dataIndex: 'opt_result',
    width: 80,
    render: v => basic.formatDDIC(`order.opt_result.${v}`, '-'),
    rules: [
      'askforcancel',
      'addcancelorder',
      'askforcancel_place_on',
    ]
  },
  // 客户名称
  {
    title: 'app.common.customerName',
    dataIndex: 'customer_name',
    width: 162,
    rules: [
      'default',
      'manual',
      'audit',
      'audited',
      'audit_not',
      'reject',
      'replenish_able',
      'redelivery_able',
      'askforcancel_able',
      'abnormal',
      'abnormal_dealwith',
      'abnormal_no_dealwith',
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
      'askforcancel_place_on',
    ]
  },
  //国家
  {
    title: 'app.common.country',
    dataIndex: 'country_name',
    width: 100,
    rules: [
      'default',
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
      'askforcancel_place_on',
    ]
  },
  // 语言
  {
    title: 'app.common.language',
    dataIndex: 'language_name',
    width: 100,
    rules: [
      'default',
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
      'askforcancel_place_on',
    ]
  },
  // 电话号码
  {
    title: 'app.common.phone',
    dataIndex: 'tel',
    width: 160,
    rules: [
      'default',
      [
        'manual',
        (v, row, index, { eventEmitter }) => (
          <a onClick={() => eventEmitter.emit(index)}>
            <IconFont type="icon-phone" style={{ marginRight: 6 }} />
            {v}
          </a>
        )
      ],
      'audit',
      'audited',
      'audit_not',
      'reject',
      'abnormal',
      'abnormal_dealwith',
      'abnormal_no_dealwith',
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
      'askforcancel_place_on',
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
      'manual',
      'audit',
      'audited',
      'audit_not',
      'reject',
      'replenish_able',
      'redelivery_able',
      'askforcancel_able',
      'abnormal',
      'abnormal_dealwith',
      'abnormal_no_dealwith',
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
      'askforcancel_place_on',
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
      'manual',
      'audit',
      'audited',
      'audit_not',
      'reject',
      'replenish_able',
      'redelivery_able',
      'askforcancel_able',
      'abnormal',
      'abnormal_dealwith',
      'abnormal_no_dealwith',
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
      'askforcancel_place_on',
    ],
  },
  // 商品总金额
  {
    title: 'app.common.goodsAmount',
    dataIndex: 'sale_amount',
    width: 200,
    align: 'right',
    render: v => numeral(v).format('0,0.00'),
    rules: [
      'default',
      'manual',
      'audit',
      'audited',
      'audit_not',
      'reject',
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
    ],
  },
  // 优惠金额
  {
    title: 'app.common.discountAmount',
    dataIndex: 'discount_amount',
    width: 200,
    align: 'right',
    render: v => numeral(v).format('0,0.00'),
    rules: [
      'default',
      'manual',
      'audit',
      'audited',
      'audit_not',
      'reject',
    ]
  },
  // 预付金额
  {
    title: 'app.common.advancedAmount',
    dataIndex: 'received_amount',
    width: 200,
    align: 'right',
    render: v => numeral(v).format('0,0.00'),
    rules: [
      'default',
      'manual',
      'audit',
      'audited',
      'audit_not',
    ]
  },
  // 订单总金额
  {
    title: 'app.common.orderTotalAmount',
    dataIndex: 'order_amount',
    width: 200,
    align: 'right',
    render: v => numeral(v).format('0,0.00'),
    rules: [
      'default',
      'manual',
      'audit',
      'audited',
      'audit_not',
      'reject',
      'replenish_able',
      'redelivery_able',
      'askforcancel_able',
      'abnormal',
      'abnormal_dealwith',
      'abnormal_no_dealwith',
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
      'askforcancel_place_on',
    ]
  },
  //下单类型
  {
    title: 'app.common.underOrderType',
    dataIndex: 'order_source',
    width: 100,
    align: 'center',
    render: v => basic.formatDDIC(`order.order_source.${v}`, '-'),
    rules: [
      'default',
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
      'askforcancel_place_on',
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
      ['manual', (v, row) => basic.formatDDIC(`order.order_second_type.${row.order_second_type}`, '-')],
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
      'askforcancel_place_on',
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
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
      'askforcancel_place_on',
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
      'default',
      'manual',
      'audit',
      'audited',
      'audit_not',
      'reject',
      'replenish_able',
      'redelivery_able',
      'askforcancel_able',
      'abnormal',
      'abnormal_dealwith',
      'abnormal_no_dealwith',
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
      'askforcancel_place_on',
    ]
  },
  // 物流状态
  {
    title: 'app.common.logisticsStatus',
    dataIndex: 'shipping_status',
    width: 230,
    render: (v, row, index, { formatMessage }) => {
      let abnormalStatus = basic.formatDDIC(`order.shipping_status.${v}`, '-');
      let abnormalReason = row?.abnormal_remark;
      let isAbnomalOrder = !!abnormalReason;
      return isAbnomalOrder ? `${abnormalStatus} (${abnormalReason})` : abnormalStatus;
    },
    rules: [
      'default',
      'manual',
      'audit',
      'audited',
      'audit_not',
      'reject',
      'replenish_able',
      'redelivery_able',
      'askforcancel_able',
      'abnormal',
      'abnormal_dealwith',
      'abnormal_no_dealwith',
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
      'askforcancel_place_on',
    ]
  },
  // 邮编
  {
    title: 'app.common.zipCode',
    dataIndex: '',
    width: 100,
    rules: [
      'repeat',
      'invalid'
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
      'manual',
      'audit',
      'audited',
      'audit_not',
      'reject',
      'askforcancel_able',
      'abnormal',
      'abnormal_dealwith',
      'abnormal_no_dealwith',
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
      'askforcancel_place_on',
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
      'manual',
      'audit',
      'audited',
      'audit_not',
      'reject',
      'abnormal',
      'abnormal_dealwith',
      'abnormal_no_dealwith',
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
      'askforcancel_place_on',
    ]
  },
  // 售前处理
  {
    title: 'app.common.preSaleHandle',
    dataIndex: 'pre_opt_type',
    width: 100,
    align: 'center',
    render: v => basic.formatDDIC(`order.pre_opt_type.${v}`, '-'),
    rules: [
      'default',
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
      'customer_order',
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
      'manual',
      'audit'
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

