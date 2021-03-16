import { SelectAction } from '@/components';
import { Button, Input } from 'antd';
export default {
  manual: ({ formatMessage, eventEmitter }) => (
    <SelectAction
      actions={[
        {
          title: formatMessage({ id: 'app.common.regularOrders'}), // 常规订单
          onClick: () => eventEmitter.emit('link-to:create'),
        },
        {
          title: formatMessage({ id: 'app.common.replenishOrders' }), // 补发订单
          onClick: () => eventEmitter.emit('open-modal:replenish'),
        },
        {
          title: formatMessage({ id: 'app.common.redeliveryOrders' }), //重发订单
          onClick: () => eventEmitter.emit('open-modal:redelivery'),
        },
        {
          title: formatMessage({ id: 'app.common.clueOrders' }), //线索订单
          onClick: () => eventEmitter.emit('open-modal:clue'),
        },
        {
          title: formatMessage({ id: 'app.common.abnormal_redelivery' }), // 异常重发订单
          onClick: () => eventEmitter.emit('open-modal:abnormal_redelivery'),
        }
      ]}
    >
      <Button type="primary">
        { formatMessage({ id: 'app.common.addOrder' })}
      </Button>
    </SelectAction>
  ),
  askforcancel: ({ formatMessage, eventEmitter }) => {
    return (
      <Button
        type='primary'
        onClick={() => eventEmitter.emit('open-modal:askforcancel')}>
        { formatMessage({ id: 'app.common.addCancelApplyOrder' })}
      </Button>
    )
  },

};


