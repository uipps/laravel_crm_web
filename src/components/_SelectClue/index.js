import { useState, useEffect } from 'react';
import { history, useIntl, useRequest, useModel } from 'umi';
import { Modal, Radio, Input } from 'antd';
import { _, Explain } from '@/utils';
import cfgs from '@/config/clue';
import { DataSheet } from '..';
import services from '@/services';

let explain = new Explain(cfgs)
export default function ({
  apiPrefix = '',
  apiType = 'default',
  onOk
}) {
  const { formatMessage } = useIntl(); // 语言包国际化方案函数
  const [order_no, setSearchOrderNo] = useState(); // 输入的订单号
  const [selectKey, setSelectKey] = useState(null); // 选中的行ID
  const { _selectClue } = useModel('modal');
  const { data, loading, run: runList } = useRequest(services.clueListAble, { manual: true })
  useEffect(() => {
    _selectClue.visible && runList({ order_no })
  }, [_selectClue.visible, order_no]);

  const onOkModal = () => {
    _selectClue.setVisible(false)
    onOk && onOk(selectKey)
  };
  // 根据单号搜索订单
  const searchOrder = (value) => {
    setSearchOrderNo(value);
  };
  let columns  = explain.setRuleKey('clue-order').setFormatMessage(formatMessage).generateColumns()

  return (
    <Modal
      title={formatMessage({id: 'app.common.selectClue'})}
      visible={_selectClue.visible}
      onCancel={() => _selectClue.setVisible(false)}
      okText={formatMessage({ id: 'app.global.ok' })}
      cancelText={formatMessage({ id: 'app.global.cancel' })}
      width={1200}
      bodyStyle={{ margin: -16 }}
      afterClose={() => setSelectKey(null)}
      onOk={onOkModal}
      destroyOnClose
    >

      <DataSheet
        extra={
          <Input.Search
            placeholder={formatMessage({ id: 'app.common.customerName' })}
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
