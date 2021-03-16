import { useState, useCallback, useEffect } from 'react';

import { useModel, useIntl, useRequest } from 'umi';
import { Modal, Checkbox, Button, Tag, Input, InputNumber } from 'antd';
import { DataSheet, Picture } from '..';
import services from '@/services';
import { numeral } from '@/utils'
import './style.less'

export default function ({
  onOk,
  form,
  value = "goods_info",
  ...props }) {
  const country_id = form.getFieldValue('country_id');
  const { formatMessage } = useIntl(); // 语言包国际化方案函数
  let [items, setItems] = useState([]); // 选中的项目
  let { _selectGoods } = useModel('modal'); // 弹窗可见性状态
  let { data, loading, run, mutate } = useRequest(services.selectGoods, {
    manual: true,
    cacheKey: 'goods-list'
  });

  useEffect(() => {
    if (_selectGoods.visible) {
      run({ country_id })

      if (form) {
        let values = form.getFieldValue([value]) || []
        setItems(values)
      }
    }
  }, [_selectGoods.visible])
  // 设置选中的项目

  const columns = [
    {
      title: ' ',
      width: 74,
      dataIndex: 'pic_url',
      render: v => <Picture src={v} mode="aspectFit" width={58} height={58} />,
    },
    {
      title: formatMessage({ id: 'app.common.goodsName', defaultMessage: '商品名称' }),
      dataIndex: 'internal_name',
    },
    {
      title: formatMessage({ id: 'app.common.attribute', defaultMessage: '属性' }),
      align: 'center',
      dataIndex: ['option_values', 'title']
    },
    {
      title: formatMessage({ id: 'app.common.sku', defaultMessage: 'SKU' }),
      width: 180,
      align: 'center',
      dataIndex: 'sku',
    },
    {
      title: formatMessage({ id: 'app.common.price', defaultMessage: '价格' }),
      width: 180,
      align: 'right',
      dataIndex: 'unit_price',
      render: v => numeral(v).format('0,0.00'),
    },
    {
      title: formatMessage({ id: 'app.global.select', defaultMessage: '选择' }),
      width: 50,
      align: 'center',
      render: item => (
        <Checkbox
          checked={items.findIndex(d => d.sku == item.sku) !== -1}
        />
      ),
    }
  ];
  const onSubmit = () => {
    // let result = items.map(d => ({ ...d, num: 1 }));
    onOk && onOk(items);
    _selectGoods.setVisible(false);
  };
  const onSearch = (internal_name) => {

    run({ fuzzy: internal_name, country_id })
  }
  // 选中项目
  const onItemClick = record => {
    setItems(items => {
      return items.findIndex(item => item.sku === record.sku) !== -1
        ? items.filter(d => d.sku !== record.sku)
        : [...items, record];
    });
  };
  // 移除标签
  const onRemove = (e, record) => {
    e.preventDefault();
    setItems(items => items.filter(item => item.sku !== record.sku));
  };

  const extra = (
    <>
      <div className="extra-wraper">
        <div className="extra-search">
          <Input.Search style={{ width: 200, marginRight: 16, padding: "2px 11px" }} onSearch={onSearch} />
        </div>
        <div className="extra-goods-list">
          {Array.isArray(items) && items.map(item => (
            <Tag key={item.sku} closable onClose={e => onRemove(e, item)} style={{ margin: 4 }}>
              {item.internal_name}
            </Tag>
          ))}
        </div>
      </div>
    </>
  );
  return (
    <>
      <Modal
        title={formatMessage({ id: 'app.message.selectGoods' })}
        width={800}
        visible={_selectGoods.visible}
        bodyStyle={{ margin: -16 }}
        onCancel={() => _selectGoods.setVisible(false)}
        okText={formatMessage({ id: 'app.global.ok' })}
        cancelText={formatMessage({ id: 'app.global.cancel' })}
        onOk={onSubmit}
        destroyOnClose
      >
        <DataSheet
          loading={loading}
          scroll={{ y: 418 }}
          extra={extra}
          dataSource={data?.list ?? []}
          onRow={record => ({
            onClick: () => onItemClick(record),
          })}
          columns={columns}
        />
      </Modal>
    </>
  );
}
