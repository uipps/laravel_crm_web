import { SelectAction } from '@/components';
import { Button, Input } from 'antd';

export const cfgs = {
  manual: ({ history, formatMessage, emitter }) => {
    return (
      <SelectAction
        actions={[
          {
            title: formatMessage({id: 'app.common.regularOrders'}),
            onClick: () => history.push('/pre-sales/order/creation_manual'),
          },
          {
            title: formatMessage({id: 'app.common.replenishOrders'}),
            onClick: () => emitter.emit('open-modal:replenish'),
          },
          {
            title: formatMessage({id: 'app.common.redeliveryOrders'}),
            onClick: () => emitter.emit('open-modal:redelivery'),
          },
        ]}
      >
        <Button type="primary">{formatMessage({id: 'app.common.dropDownOption'})}</Button>
      </SelectAction>
    )
  },
  askforcancel: ({ history, formatMessage, emitter }) => {
    return (<Button type='primary' onClick={() => emitter.emit('open-modal:addcancelorder')}>{formatMessage({id: 'app.common.addAskForCancelOrder'})}</Button>)
  },

};

export default function (type, rest) {
  let extra = type in cfgs ? cfgs[type] : () => { };
  return extra(rest);
}
