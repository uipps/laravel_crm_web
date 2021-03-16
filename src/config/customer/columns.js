import { basic } from '@/utils';
import { Link, history } from 'umi'

export default [
  // 客户id
  {
    title: 'app.common.customerId',
    dataIndex: 'id',
    fixed: true,
    width: 80,
    rules: [
      'pre_customer',
      'after_customer',
      'unassigned',
      'assigned',
    ]
  },
  // 客户姓名
  {
    title: 'app.common.customerFullName',
    dataIndex: 'customer_name',
    render(t, r) {
      const module = history.location.pathname.includes('/pre-sales') ? 'pre-sales' : 'after-sales'
      return (
        <Link to={`/${module}/customer/${r.id}`}>{t}</Link>
      );
    },
    fixed: true,
    width: 160,
    rules: [
      'pre_customer',
      'after_customer',
      'unassigned',
      'assigned',
    ]
  },
  // 电话号码
  {
    title: 'app.common.phoneNumber',
    dataIndex: 'tel',
    render: v => basic.getSecretTelNum(v),
    width: 160,
    rules: [
      'pre_customer',
      'after_customer',
      'unassigned',
      'assigned',
    ]
  },
  // 国家
  {
    title: 'app.common.country',
    dataIndex: 'country_name',
    width: 120,
    rules: [
      'pre_customer',
      'after_customer',
      'unassigned',
      'assigned',
    ]
  },
  // 语言
  {
    title: 'app.common.language',
    dataIndex: 'language_name',
    width: 120,
    rules: [
      'pre_customer',
      'after_customer',
      'unassigned',
      'assigned',
    ]
  },
  // 售前客服
  {
    title: 'app.common.preSaleService',
    dataIndex: 'pre_sale_name',
    width: 160,
    rules: [
      'pre_customer',
      'after_customer',
      'assigned',
    ]
  },
  // 分配状态
  {
    title: 'app.common.distributionStatus',
    dataIndex: 'distribution_status',
    width: 100,
    render: t => basic.formatDDIC(`order.distribute_status.${t}`, '-'),
    rules: [
      'after_customer',
    ]
  },
  // 售后客服
  {
    title: 'app.common.afterSaleService',
    dataIndex: 'after_sale_name',
    width: 160,
    rules: [
      'pre_customer',
      'after_customer',
      'assigned',
    ]
  },
  // 分配时间
  {
    title: 'app.common.distributed_time',
    dataIndex: 'distributed_time',
    width: 160,
    rules: [ 
      'after_customer',
      'assigned',
    ]
  },
  // 客户质量
  {
    title: 'app.common.customerQuality',
    dataIndex: 'quality_level',
    align: 'center',
    width: 80,
    render(t) {
      return <>{basic.formatDDIC(`order.quality_level.${t}`, '-')}</>;
    },
    rules: [
      'pre_customer',
      'after_customer',
      'assigned',
    ]
  },
  // 创建时间
  {
    title: 'app.common.createDate',
    dataIndex: 'created_time',
    align: 'center',
    width: 200,
    rules: [
      'pre_customer',
      'after_customer',
    ]
  },
  // 订单数
  {
    title: 'app.common.orderNumber',
    dataIndex: 'order_num',
    width: 80,
    rules: [
      'pre_customer',
      'after_customer',
    ]
  },
  // 最近联系客户时间
  {
    title: 'app.common.lastContactTime',
    dataIndex: 'last_contact_time',
    width: 200,
    rules: [
      'pre_customer',
      'after_customer',
    ]
  },
  // 客户来源
  {
    title: 'app.common.customerSource',
    width: 120,
    dataIndex: 'source_type',
    render: t => basic.formatDDIC(`order.source_type.${t}`, '-'),
    rules: [
      'after_customer',
      'unassigned',
      'assigned',
    ]
  },
]
