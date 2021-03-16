import { Link } from 'umi'
import { IconFont } from '@/components'
import { basic, pathCompile, numeral } from '@/utils'
import { EditOutlined } from '@ant-design/icons'
const toPath = pathCompile('/pre-sales/order/:id/detail/:apiType?')

const MANUAL_TYPE = {
  2: 'replenish',
  3: 'redelivery',
  5: 'abnormal_redelivery'
}

export default [
  // 订单号
  {
    title: 'app.common.orderNo',
    dataIndex: 'order_no',
    width: 200,
    fixed: 'left',
    render: (v, row) => <Link to={toPath({ id: row.id })}>{v}</Link>,
    rules: [
      [
        'advertise',
        (v, row) => {
          return <Link to={`/pre-sales/order/${row.id}/detail`}>{v}</Link>
          // if (row.distribute_status ===  0) {
          //   return <Link to={toPath({ id: row.order_distribute_id || row.id, apiType: 'distribute_not' })}>{v}</Link>
          // } else {
          //   if (row.audit_status === 1) {
          //     return <Link to={toPath({ id: row.order_audit_id || row.id, apiType: 'audited' })}>{v}</Link>
          //   } else {
          //     return <Link to={`/pre-sales/order/${row.order_audit_id}/edit/audit`}>{v}</Link>
          //   }
          // }
        }
      ],
      [
        'audited',
        (v, row) => <Link to={toPath({ id: row.id, apiType: 'audited' })}>{v}</Link>,
      ],
      [
        'audit_not',
        (v, row) => <Link to={`/pre-sales/order/${row.id}/edit/audit`}>{v}</Link>,
      ],
      [
        'distribute_not',
        (v, row) => <Link to={toPath({ id: row.id, apiType: 'distribute_not' })}>{v}</Link>,
      ],
      [
        'distributed',
        (v, row) => <Link to={toPath({ id: row.id, apiType: 'distributed' })}>{v}</Link>,
      ],
      [
        'manual',
        (v, { id, status_manual, order_second_type }) => {
          if (status_manual === 0) {
            let href = `/pre-sales/order/create/general?id=${id}`
            if ([2, 3].includes(order_second_type)) {
              href = `/pre-sales/order/${id}/edit/${MANUAL_TYPE[order_second_type]}`
            }
            return (
              <Link to={href}>
                {v} 
                {<EditOutlined style={{marginLeft: 10, color: '#9CCC65', fontSize: 16}}/>}
              </Link>
            )
          }
          return (
            <Link to={toPath({ id: id, apiType: MANUAL_TYPE[order_second_type] || 'manual' })}>
              {v}
            </Link>
          )
        }
      ],
      [
        'repeat',
        (v, row) => <Link to={toPath({ id: row.id, apiType: 'repeat' })}>{v}</Link>
      ],
      [
        'repeat_list',
        (v, row) => <Link to={toPath({ id: row.id, apiType: 'repeat' })}>{v}</Link>
      ],
      [
        'invalid',
        (v, row) => <Link to={toPath({ id: row.id, apiType: 'invalid' })}>{v}</Link>
      ],
      [
        'abnormal',
        (v, row) => <Link to={toPath({ id: row.id, apiType: 'abnormal' })}>{v}</Link>,
      ],
      [
        'abnormal_no_dealwith',
        (v, row) => <Link to={toPath({ id: row.id, apiType: 'abnormal' }) + '?action=abnormal'}>{v}</Link>,
      ],
      [
        'abnormal_dealwith',
        (v, row) => <Link to={toPath({ id: row.id, apiType: 'abnormal' })}>{v}</Link>,
      ],
      [
        'askforcancel',
        (v, { id, status_cancel }) => {
          if (status_cancel === 0) {
            return <Link to={`/pre-sales/order/${id}/edit/askforcancel`}>{v}</Link>
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
    width: 100,
    render: v => basic.formatDDIC(`order.opt_result.${v}`, '-'),
    rules: [
      'askforcancel',
      'askforcancel_place_on',
    ]
  },
  // 重复单处理
  {
    title: 'app.common.cancelStatus',
    dataIndex: 'status_repeat',
    width: 100,
    render: v => basic.formatDDIC(`order.status_repeat.${v}`, '-'),
    rules: [
      'repeat_list'
    ]
  },
  // 客户名称
  {
    title: 'app.common.customerName',
    dataIndex: 'customer_name',
    width: 162,
    rules: [
      'advertise',
      'audit_not',
      'audited',
      'distribute_not',
      'distributed',
      'manual',
      'repeat',
      'repeat_list',
      'invalid',
      'abnormal',
      'abnormal_no_dealwith',
      'abnormal_dealwith',
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
    dataIndex: ['country', 'display_name'],
    width: 120,
    rules: [
      'advertise',
      'audit_not',
      'audited',
      'distribute_not',
      'distributed',
      'repeat',
      'repeat_list',
      'invalid',
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
    dataIndex: ['language', 'display_name'],
    width: 100,
    rules: [
      'advertise',
      'audit_not',
      'audited',
      'distribute_not',
      'distributed',
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
    render: (v) => basic.getSecretTelNum(v),
    rules: [
      'advertise',
      [
        'audit_not',
        (v, row, index, { eventEmitter }) => (
          <a onClick={() => eventEmitter.emit(index)}>
            <IconFont type="icon-phone" style={{ marginRight: 6 }} />
            {basic.getSecretTelNum(v)}
          </a>
        )
      ],
      'audited',
      'distribute_not',
      'distributed',
      'manual',
      'repeat',
      'repeat_list',
      'invalid',
      'abnormal',
      'abnormal_no_dealwith',
      'abnormal_dealwith',
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
    width: 250,
    className: 'data-element',

    render: v => Array.isArray(v) && v.length ? v.map(item => <span key={item.id}>{item.internal_name}</span>) : '-',
    rules: [
      'advertise',
      'audit_not',
      'audited',
      'distribute_not',
      'distributed',
      'manual',
      'repeat',
      'repeat_list',
      'invalid',
      'abnormal',
      'abnormal_no_dealwith',
      'abnormal_dealwith',
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
    width: 80,
    render: v => Array.isArray(v) && v.length ? v.reduce((pre, next) => pre + next.num, 0) : '-',
    rules: [
      'advertise',
      'audit_not',
      'audited',
      'distribute_not',
      'distributed',
      'manual',
      'repeat',
      'repeat_list',
      'invalid',
      'abnormal',
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
      'advertise',
      'audit_not',
      'audited',
      'repeat',
      'manual',
      'repeat_list'
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
      'advertise',
      'audit_not',
      'audited',
      'manual',
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
      'advertise',
      'audit_not',
      'audited',
      'manual',
    ]
  },
  // 应收金额
  {
    title: 'app.common.receivableAmount',
    dataIndex: 'collect_amount',
    width: 200,
    align: 'right',
    render: v => numeral(v).format('0,0.00'),
    rules: [
      'advertise',
      'audit_not',
      'audited',
      'manual',
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
      'advertise',
      'audit_not',
      'audited',
      'distribute_not',
      'distributed',
      'manual',
      'invalid',
      'abnormal',
      'abnormal_no_dealwith',
      'abnormal_dealwith',
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
    dataIndex: 'order_type',
    width: 120,
    render: v => basic.formatDDIC(`order.order_type.${v}`, '-'),
    rules: [
      'advertise',
      'audit_not',
      'audited',
      'distribute_not',
      'distributed',
      'abnormal',
      'abnormal_no_dealwith',
      'abnormal_dealwith',
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
    dataIndex: 'order_scope',
    width: 120,
    render: v => basic.formatDDIC(`order.order_scope.${v}`, '-'),
    rules: [
      'advertise',
      'audit_not',
      'audited',
      'distribute_not',
      'distributed',
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
    width: 100,
    render: v => basic.formatDDIC(`order.sms_verify_status.${v}`, '-'),
    rules: [
      'advertise',
      'audit_not',
      'distribute_not',
      'distributed',
      'invalid',
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
    width: 120,
    render: v => basic.formatDDIC(`order.audit_status.${v}`, '-'),
    rules: [
      'distribute_not',
    ],
  },
  // 订单状态
  {
    title: 'app.common.orderStatus',
    dataIndex: 'order_status',
    width: 120,
    render: v => basic.formatDDIC(`order.order_status.${v}`, '-'),
    rules: [
      'advertise',
      'audited',
      'distributed',
      'manual',
      'abnormal',
      'abnormal_no_dealwith',
      'abnormal_dealwith',
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
    width: 160,
    render: (v, row, index, { formatMessage }) => {
      let abnormalStatus = basic.formatDDIC(`order.shipping_status.${v}`, '-');
      let abnormalReason = row?.abnormal_remark;
      let isAbnomalOrder = !!abnormalReason;
      return isAbnomalOrder ? `${abnormalStatus} (${abnormalReason})` : abnormalStatus;
    },
    rules: [
      'advertise',
      'audited',
      'distributed',
      'manual',
      'abnormal',
      'abnormal_no_dealwith',
      'abnormal_dealwith',
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
    dataIndex: 'zip_code',
    width: 100,
    rules: [
      'repeat',
      'repeat_list',
      'invalid',
    ],
  },
  // 地址
  {
    title: 'app.common.address',
    dataIndex: 'address',
    width: 200,
    rules: [
      'repeat',
      'repeat_list',
      'invalid',
    ],
  },
  // 留言
  {
    title: 'app.common.leaveWord',
    dataIndex: 'customer_remark',
    width: 220,
    rules: [
      'repeat',
      'repeat_list',
      'invalid',
    ],
  },
  // 订单时间
  {
    title: 'app.common.orderDate',
    dataIndex: 'order_time',
    width: 200,
    rules: [
      'advertise',
      'audit_not',
      'audited',
      'distribute_not',
      'distributed',
      'manual',
      'repeat',
      'repeat_list',
      'invalid',
      'abnormal_no_dealwith',
      'abnormal_dealwith',
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
    render: v => basic.formatDDIC(`order.distribute_status.${v}`, '-'),
    rules: [
      'advertise',
    ],
  },
  // 售前客服
  {
    title: 'app.common.preSaleService',
    dataIndex: ['pre_sale', 'real_name'],
    width: 150,
    rules: [
      'advertise',
      'audit_not',
      'audited',
      'distributed',
      'abnormal',
      'abnormal_no_dealwith',
      'abnormal_dealwith',
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
    width: 200,
    render: v => basic.formatDDIC(`order.pre_opt_type.${v}`, '-'),
    rules: [
      'advertise',
      'audit_not',
      'audited',
      'distributed',
      'abnormal',
      'abnormal_no_dealwith',
      'abnormal_dealwith',
      'askforcancel',
      'askforcancel_no_dealwith',
      'askforcancel_cancel_succ',
      'askforcancel_cancel_fail',
      'askforcancel_place_on',
    ]
  },
  // 最后处理时间
  {
    title: 'app.common.lastDisposeTime',
    dataIndex: 'pre_opt_time',
    width: 100,
    render: v => v,
    rules: [
    ]
  },
  // 售前审核
  {
    title: 'app.common.preAuditStatus',
    dataIndex: 'audit_status',
    width: 100,
    render: v => basic.formatDDIC(`order.audit_status.${v}`, '-'),
    rules: [
      'advertise',
      'distributed',
      'abnormal',
      'abnormal_no_dealwith',
      'abnormal_dealwith',
    ]
  },
  // 异常处理
  {
    title: 'app.common.abnormalStatus',
    dataIndex: 'invalid_status',
    width: 130,
    render: v => basic.formatDDIC(`order.status_abnormal.${v}`, '-'),
    rules: [
      'abnormal',
      'abnormal_no_dealwith',
      'abnormal_dealwith',
    ]
  },
  //查看重复单
  {
    title: 'app.global.action',
    width: 100,
    fixed: 'right',
    render: (v, row, index, { formatMessage }) => {
      return <Link to={`/pre-sales/order/${row.id}/repeat_list`}>{formatMessage({ id: 'app.common.repeatView' })}</Link>
    },
    rules: [
      'repeat'
    ]
  },
  //查看重复单
  {
    title: 'app.global.action',
    width: 150,
    fixed: 'right',
    render: (v, row, index, { formatMessage, eventEmitter }) => {
      return (
        <>
          <a
            disabled={row.status_repeat === -1}
            onClick={() => eventEmitter.emit(`reset-valid:${row.id}`)}
          >
            {formatMessage({ id: 'app.common.resetValid' })}
          </a>
          <a
            disabled={row.status_repeat === -1}
            onClick={() => eventEmitter.emit(`reset-invalid:${row.id}`)}
            style={{ marginLeft: 8 }}
          >
            {formatMessage({ id: 'app.common.resetInvalid' })}
          </a>
        </>
      )
    },
    rules: [
      'repeat_list'
    ]
  }
];

