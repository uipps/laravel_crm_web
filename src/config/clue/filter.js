import { basic } from '@/utils';

export default [
  {
    id: 'name',
    label: 'app.common.customerName', // 客户名称
    type: 'input',
    rules: [
      'default',
      'distribute_not',
      'no_dealwith',
      'distributed',
      'dealwith',
      'finished',
    ]
  },
  {
    id: 'inputMulti',
    label: 'app.common.media-account', // 社媒账号
    type: 'selectAndInput',
    options: basic.formatDDIC('customer_clue.social_account_type', true),
    rules: [
      'default',
      'distribute_not',
      'no_dealwith',
      'distributed',
      'dealwith',
      'finished',
    ]
  },
  {
    id: 'finish_status',
    label: 'app.common.closingStatus', // 成交状态
    type: 'select',
    options: basic.formatDDIC('customer_clue.finish_status', true),
    placeholder: 'app.global.all',
    rules: [
      'default'
    ]
  },
];
