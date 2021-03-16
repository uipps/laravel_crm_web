import { useState, useEffect } from 'react';
import { history, useIntl, useRequest, useModel } from 'umi';
import { useSize } from '@umijs/hooks';
import { Modal, Radio, Input } from 'antd';
import { _ } from '@/utils';
import { DataSheet } from '..';
import services from '@/services';
const preService = services.pre;

export default function ({
  columns
}) {
  const intl = useIntl(); // 语言包国际化方案函数
  const [size] = useSize(document.body)
  const [order_no, setSearchOrderNo] = useState("");
  const { orderModal, tableRow } = useModel('order');
  const { data, loading, run: runList } = useRequest(preService.orderList, { manual: true })
  const { formatMessage } = useIntl();
  const TITLE = {
    'redelivery': formatMessage({ id: 'app.common.originRedeliveryOrder' }),
    'addcancelorder': formatMessage({ id: 'app.common.selectOriginOrder' }),
    'replenish': formatMessage({ id: 'app.common.replenishOrder' }),
  }
  useEffect(() => {
    if (orderModal.visible) {
      let type = orderModal.visible === 'addcancelorder' ? 'askforcancel/optional_order' : orderModal.visible;
      runList({ type, order_no })
    }
  }, [orderModal.visible, order_no]);

  const onOkModal = () => {
    history.push(`/pre-sales/order/${tableRow.selectedRowKey}/${orderModal.visible}`)
    orderModal.setVisible(false)
  };
  // 根据单号搜索订单
  const searchOrder = (value) => {
    setSearchOrderNo(value);
  };
  return (
    <Modal
      title={orderModal.visible && TITLE[orderModal.visible]}
      visible={!!orderModal.visible}
      onCancel={() => orderModal.setVisible(false)}
      okText={intl.formatMessage({ id: 'app.global.ok' })}
      cancelText={intl.formatMessage({ id: 'app.global.cancel' })}
      width={size.width - 240}
      bodyStyle={{ margin: -16 }}
      afterClose={() => tableRow.setRowKey(null)}
      onOk={onOkModal}
      destroyOnClose
    >

      <DataSheet
        extra={
          <Input.Search
            placeholder={formatMessage({ id: 'app.common.placeholder.inputOrderNo' })}
            onSearch={searchOrder}
            style={{ width: 200 }}
          ></Input.Search>
        }
        style={{ height: 500 }}
        columns={columns}
        dataSource={data?.list ?? []}
        loading={loading}
        onRow={record => ({
          onClick: () => tableRow.setRowKey(record.id),
        })}
      />
    </Modal>
  );
}
