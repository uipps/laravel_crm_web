import { createRef, useState, useEffect } from 'react';
import { useIntl, useRequest, useModel } from 'umi';
import { useSize } from '@umijs/hooks';
import { Input, Select, Modal, Radio } from 'antd';
import { _, basic } from '@/utils';
import { DataSheet } from '..';
import services from '@/services';
const preService = services.pre;
export default function({ visible, onCancel, onOk }) {
  const { formatMessage } = useIntl(); // 语言包国际化方案函数
  const [searchKey, setSeachKey] = useState('customer_name')
  const [selectedItem, setSelectedItem] = useState({}); // 设置当前选中的行数据
  const { _selectCustomer } = useModel('modal');
  const { data = {}, run, loading } = useRequest(preService.customerAddress, {
    manual: true,
    formatResult: v => {
      let group = _.groupBy(v.data.list, item => item.customer_id); // 将其分组
      let list = _.flatten(_.map(group, d => d)); // 分组后 重新组装数组
      group = _.mapValues(group, item => item.map(o => o.id));
      return { ...v.data, group, list };
    },
    cacheKey: 'customer-list',
  });
  useEffect(() => {
    _selectCustomer.visible && run();
  }, [_selectCustomer.visible]);
  let { list = [], group = [] } = data;

  const columns = [
    {
      title: formatMessage({ id: 'app.common.customerId', defaultMessage: '客户ID' }),
      width: 80,
      dataIndex: 'customer_id',
      render: (value, row) => {
        let _group = group[value] || [];
        let index = _group.findIndex(d => d === row.id);
        return {
          children: value,
          props: {
            rowSpan: index > 0 ? 0 : _group.length,
          },
        };
      },
    },
    {
      title: formatMessage({ id: 'app.common.customerName', defaultMessage: '客户名称' }),
      dataIndex: 'customer_name'
    },
    {
      title: formatMessage({ id: 'app.common.phoneNumber', defaultMessage: '电话号码' }),
      align: 'center',
      width: 120,
      render: v => basic.getSecretTelNum(v),
      dataIndex: 'tel'
    },
    {
      title: formatMessage({ id: 'app.common.zipCode', defaultMessage:  '邮编' }),
      align: 'center',
      width: 120,
      dataIndex: 'zip_code'
    },
    {
      title: formatMessage({ id: 'app.common.shippingAddress', defaultMessage: '收货地址' }),
      dataIndex: 'address'
    },
    {
      title: formatMessage({ id: 'app.global.select', defaultMessage: '选择' }),
      width: 80,
      align: 'center',
      render: d => <Radio checked={d.id === selectedItem.id} />,
    },
  ];
  // search搜索
  const onSearch = (value, e) => {
    e.stopPropagation()
    let values = !value ? {} : { [searchKey]: value }
    run(values)
  }
  const onSubmit = () => {
    _selectCustomer.setVisible(false);
    onOk && onOk(selectedItem);
  };
  const extra = (
    <Input.Group compact>
      <Select
        value={searchKey}
        onChange={v => setSeachKey(v)}
        options={[
          { value: 'tel', label: formatMessage({ id: 'app.common.phoneNumber', defaultMessage: '电话号码' }) },
          { value: 'customer_id', label: formatMessage({ id: 'app.common.customerId', defaultMessage: '客户ID' }) },
          { value: 'customer_name', label: formatMessage({ id: 'app.common.customerName', defaultMessage: '客户名称' }) },
        ]}
      />
      <Input.Search style={{ width: 160 }} onSearch={onSearch} />
    </Input.Group>
  )
  return (
    <Modal
      title={formatMessage({ id: 'app.common.selectUser' })}
      visible={_selectCustomer.visible}
      onCancel={() => _selectCustomer.setVisible(false)}
      okText={formatMessage({ id: 'app.global.ok' })}
      cancelText={formatMessage({ id: 'app.global.cancel' })}
      width={1200}
      bodyStyle={{ padding: 0, display: 'flex' }}
      afterClose={() => setSelectedItem({})}
      onOk={onSubmit}
      okButtonProps={{
        disabled: !(selectedItem && selectedItem.id)
      }}
      destroyOnClose
    >
      <DataSheet
        extra={extra}
        scroll={{ y: 500 }}
        columns={columns}
        dataSource={list}
        loading={loading}
        rowClassName={
            (record) => {
              return 'wjb'
            }
        }
        onRow={record => ({
          onClick: () => setSelectedItem(record),
        })}
      />
    </Modal>
  );
}
