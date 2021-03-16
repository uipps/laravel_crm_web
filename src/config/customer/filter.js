import { basic, store } from '@/utils';

export default [
  // 客户姓名/ID
  {
    id: 'customer_name_id',
    label: 'app.common.nameAndId',
    type: 'input',
    placeholder: 'app.common.placeholder.input',
    rules: [
      'pre_customer',
      'after_customer',
      'unassigned',
      'assigned',
    ]
  },
  // 电话
  {
    id: 'tel',
    label: 'app.common.phone',
    type: 'input',
    placeholder: 'app.common.placeholder.input',
    rules: [
      'pre_customer',
      'after_customer',
      'unassigned',
      'assigned',
    ]
  },
  // 客户质量
  {
    id: 'quality_level',
    label: 'app.common.customerQuality',
    type: 'select',
    options: basic.formatDDIC('order.quality_level', true),
    placeholder: 'app.common.placeholder.select',
    rules: [
      'pre_customer',
      'after_customer',
      'unassigned',
      'assigned',
    ]
  },
  // 分配时间
  {
    id: 'distributed_time',
    label: 'app.common.distributed_time',
    type: 'datePicker',
    rules: [
      'after_customer',
      'assigned',
    ]
  },
  // 语言
  {
    id: 'language_id',
    label: 'app.common.language',
    type: 'select',
    options: [],
    optionsMap: {
      label: 'name',
      value: 'id'
    },
    placeholder: 'app.common.placeholder.select',
    rules: [
      ['unassigned', (item, data) => ({ ...item, options: data.language })]
    ]
  },
];
