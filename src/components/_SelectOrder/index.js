import { useState, useEffect } from 'react';
import { history, useIntl, useRequest, useModel } from 'umi';
import { Modal, Radio, Input } from 'antd';
import { _, Explain } from '@/utils';
import { DataSheet } from '..';

import columnCfgs from './columns';
import services from '@/services';

let explain = new Explain(columnCfgs)

export default function ({
  platform = 'after',
  apiPrefix = '',
  apiType = 'default',
  onOk
}) {
  const { formatMessage } = useIntl(); // 语言包国际化方案函数
  const [order_no, setSearchOrderNo] = useState(); // 输入的订单号
  const [selectKey, setSelectKey] = useState(null); // 选中的行ID
  const { _selectOrder } = useModel('modal');
  const { data, loading, run: runList } = useRequest(services[`${platform}SalesOrderList`], { manual: true })
  useEffect(() => {
    _selectOrder.visible && runList({
      apiType: `${apiType}${apiPrefix}`,
      order_no
    })
  }, [_selectOrder.visible, order_no]);

  const onOkModal = () => {
    _selectOrder.setVisible(false)
    onOk && onOk(selectKey)
  };

  // 根据单号搜索订单
  const searchOrder = (value) => {
    setSearchOrderNo(value);
  };
  let columns  = explain.setRuleKey(`${apiType}${apiPrefix}`).setFormatMessage(formatMessage).generateColumns()

  const title = apiType && formatMessage({ id: 'app.common.select-original' }, {
    value: formatMessage({
      id: 'app.common.' + apiType,
    })
  })
  return (
    <Modal
      title={title}
      visible={_selectOrder.visible}
      onCancel={() => _selectOrder.setVisible(false)}
      okText={formatMessage({ id: 'app.global.ok' })}
      cancelText={formatMessage({ id: 'app.global.cancel' })}
      width={1200}
      bodyStyle={{ margin: -16 }}
      afterClose={() => setSelectKey(null)}
      onOk={onOkModal}
      destroyOnClose
      okButtonProps={{
        disabled: !selectKey
      }}
    >
      <DataSheet
        extra={
          <Input.Search
            placeholder={formatMessage({ id: 'app.common.placeholder.inputOrderNo' })}
            onSearch={searchOrder}
            style={{ width: 200 }}
          />
        }
        scroll={{ y: 500 }}
        columns={[
          ...columns,
          {
            title: formatMessage({ id: 'app.global.select' }),
            width: 80,
            align: 'center',
            fixed: 'right',
            render: (row) => <Radio checked={row.id === selectKey}/>
          }
        ]}
        dataSource={data?.list ?? []}
        loading={loading}
        onRow={record => ({
          onClick: () => setSelectKey(record.id),
        })}
      />
    </Modal>
  );
}
