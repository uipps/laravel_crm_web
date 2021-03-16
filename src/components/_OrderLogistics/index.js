import { createRef, useState, useEffect } from 'react';
import { useIntl, useRequest, useModel, useParams } from 'umi';
import { useSize } from '@umijs/hooks';
import { Modal, Button } from 'antd';
import { _ } from '@/utils';
import { DataSheet } from '..';
import services from '@/services';

export default function() {
  const { formatMessage } = useIntl() // 语言包国际化方案函数
  const { _logistics } = useModel('modal')
  const params = useParams()
  const { data = {}, run, loading } = useRequest(services.preSalesShipping, { manual: true });
  useEffect(() => {
    _logistics.visible && run(params);
  }, [_logistics.visible]);
  let { trace_list = [], group = [] } = data;

  const columns = [
    { title: formatMessage({id: 'app.common.timeZone'}), width: 120, dataIndex: 'timezone', },
    { title: formatMessage({id: 'app.common.dateAndTime'}), width: 200, dataIndex: 'datetime' },
    { title: formatMessage({id: 'app.common.addressInfo'}), align: 'center', dataIndex: ['address', 'city'] },
    { title: formatMessage({id: 'app.common.zipCode'}), align: 'center', width: 120, dataIndex: ['address', 'postCode'] },
    { title: formatMessage({id: 'app.common.deliverySituation'}),   dataIndex: 'desc' },
  ];
  // search搜索
  return (
    <Modal
      title={formatMessage({id: 'app.common.abnomalOrderInfo'})}
      visible={_logistics.visible}
      width={1200}
      footer={<Button onClick={() => _logistics.setVisible(false) }>{formatMessage({ id: 'app.global.close' })}</Button>}
      bodyStyle={{ padding: 0, display: 'flex' }}
      onOk={() => {} }
      destroyOnClose
    >
      <DataSheet
        scroll={{ y: 500 }}
        columns={columns}
        dataSource={trace_list}
        loading={loading}
      />
    </Modal>
  );
}
