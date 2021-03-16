import { basic } from '@/utils';
import { Link } from 'umi'

export default [
  // 客户名称
  {
    width: 160,
    title: 'app.common.customerName',
    dataIndex: 'name',
    fixed: 'left',
    render(t, r) {
      return <Link to={`/after-sales/customer/origin-clue/${r.id}`}>{t}</Link>
    },
    rules: [
      'default',
      'clue-order',
      'distribute_not',
      'no_dealwith',
      'distributed',
      'dealwith',
      'finished',
    ]
  },
  // 国家
  {
    width: 160,
    title: 'app.common.country',
    dataIndex: 'country_name',
    rules: [
      'default',
      'clue-order',
      'distribute_not',
      'no_dealwith',
      'distributed',
      'dealwith',
      'finished',
    ]
  },
  // 语言
  {
    width: 160,
    title: 'app.common.language',
    dataIndex: 'language_name',
    rules: [
      'default',
      'clue-order',
      'distribute_not',
      'no_dealwith',
      'distributed',
      'dealwith',
      'finished',
    ]
  },
  // Facebook ID
  {
    width: 200,
    title: 'app.common.faceBookId',
    dataIndex: 'facebook_id',
    rules: [
      'default',,
      'distribute_not',
      'no_dealwith',
      'distributed',
      'dealwith',
      'finished',
    ]
  },
  // WhatApp ID
  {
    width: 200,
    title: 'app.common.whatAppId',
    dataIndex: 'whatsapp_id',
    rules: [
      'default',,
      'distribute_not',
      'no_dealwith',
      'distributed',
      'dealwith',
      'finished',
    ]
  },
  // Line ID
  {
    width: 200,
    title: 'app.common.lineId',
    dataIndex: 'line_id',
    rules: [
      'default',,
      'distribute_not',
      'no_dealwith',
      'distributed',
      'dealwith',
      'finished',
    ]
  },
  // 咨询类型
  {
    width: 120,
    title: 'app.common.seekType',
    dataIndex: 'advisory_type',
    render: t => basic.formatDDIC(`customer_clue.advisory_type.${t}`, '-'),
    rules: [
      'default',
      'clue-order',
      'distribute_not',
      'no_dealwith',
      'distributed',
      'dealwith',
      'finished',
    ]
  },
  // 分配状态
  {
    width: 140,
    title: 'app.common.distributionStatus',
    dataIndex: 'distribute_status',
    render: t => basic.formatDDIC(`customer_clue.distribute_status.${t}`, '-'),
    rules: [
      'default',
    ]
  },
  // 分配客服
  {
    width: 160,
    title: 'app.common.assignCustomer',
    dataIndex: 'post_sale_name',
    rules: [
      'default',
      'no_dealwith',
      'distributed',
      'dealwith',
      'finished',
    ]
  },
  // 记录追踪数
  {
    width: 100,
    title: 'app.common.tracking-number',
    dataIndex: 'track_num',
    align: 'center',
    rules: [
      'dealwith',
      'finished',
    ]
  },
  // 成交状态
  {
    width: 130,
    title: 'app.common.closingStatus',
    dataIndex: 'finish_status',
    render: t => basic.formatDDIC(`customer_clue.finish_status.${t}`, '-'),
    align: 'center',
    rules: [
      'default',
    ]
  },
  // 线索来源
  {
    width: 240,
    title: 'app.common.sourceClue',
    dataIndex: 'clue_source',
    rules: [
      'default',
      'distribute_not',
      'no_dealwith',
      'distributed',
      'dealwith',
      'finished',
    ]
  },
]
