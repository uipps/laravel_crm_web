
import { useState, useEffect } from 'react';
import { history, useIntl, useRequest, useModel } from 'umi';

import { Card, Row, Col, Input, Button, AutoComplete, message } from 'antd';

import {
  BizForm,
  FieldSelect,
  FieldInput,
  _GoodsTable,
  _SelectGoods,
  FieldText,
  Dialog
} from '@/components';

import services from '@/services';
import { basic, _, pathToRegexp, pluto } from '@/utils';

export default function ({
  route,
  match,
  location
}) {
  const [form] = BizForm.useForm();
  const { formatMessage } = useIntl(); // 语言包国际化方案函数
  let apiType = pathToRegexp('/after-sales/order/create/:apiType/:id?').exec(location.pathname)
  apiType = apiType[1] || 'general'
  const { _selectGoods } = useModel('modal'); // 连接简易的model模型
  const {
    country,
    province,
    city,
    district,
    zipCode,
    setDepend
  } = useModel('cascade') // 城市省份简易的model

  const query = location.query;
  const { data: detail } = useRequest(services.afterSalesOrderDetail, {
    // 新建时传参为params，修改时传参在query 里面。
    // 新建时在useEffect中请求客户详情，修改时在这里请求整个订单详情
    manual: !query.id,
    defaultParams: [{ apiType: 'manual', ...query }],
    onSuccess: (data) => {
      data = basic.toFormData(data, { transform: ['sms_verify_status'] });
      setDepend(data)
      form.setFieldsValue(data);
    }
  });

  // 客户详情获取
  const { run: customerRun } = useRequest(services.customerAddressDetail, {
    manual: true,
    onSuccess: data => {
      data = basic.toFormData(_.omit(data, 'id'), { transform: ['sms_verify_status'] });

      setDepend(data)
      form.setFieldsValue(data);
    }
  })
  // 线索详情获取
  const { run: clueRun } = useRequest(services.clueDetail, {
    manual: true,
    onSuccess: data => {
      data.customer_name = data.name
      data = basic.toFormData(_.omit(data, ['id', 'remark']), {});
      setDepend(data)
      form.setFieldsValue(data);
    }
  })
  // 线索订单详情获取 
  const { run: runClueOrderDetail } = useRequest(services.clueOrderDetail, {
    manual: true,
    onSuccess: data => {
      data = basic.toFormData(_.omit(data, ['id', 'remark']), {});
      setDepend(data)
      form.setFieldsValue(data);
    }
  })


  useEffect(() => {
    // 多做一层params判断，params.id存在则是新增手工单
    apiType === 'general' && match.params.id && customerRun(match.params)
    apiType === 'clue' && match.params.id && clueRun(match.params)
  }, [location, match])
  //添加保存手工单
  const { run: runSave, loading: saveLoading } = useRequest(services.afterSalesOrderCreate, {
    manual: true,
    onSuccess: () => history.push('/after-sales/order/manual'),
  });
  // 更新订单
  const { run: updateDate, loading: updateLoading } = useRequest(services.afterSalesOrderUpdate, {
    manual: true,
    onSuccess: () => {
      history.push('/after-sales/order/manual')
    }
  })
  let { data: language } = useRequest(services.queryLangs); // 异步加载语言

  const onCustomerOk = record => {
    let data = basic.toFormData(record, {});
    form.setFieldsValue(data);
  };
  // form 表单改变时
  const onValuesChange = (value) => {
    if (value.country_id) {
      form.setFieldsValue({ 'goods_info': [] });
    }
    setDepend(value)
  };

  // 1: "常规订单" 2: "补发订单" 3: "重发订单" 4: "线索订单"
  const isNeedLimitOrder = [2].includes(detail?.order_second_type)

  const onFinish = async submit_type => {
    await form.validateFields([
      'customer_name',
      'tel',
      'address',
      'language_id',
      'country_id',
      'zone_prov_name',
      'zone_city_name',
      'zone_area_name',
      'zip_code',
      ['attachment', 'file_url']
    ])
    const values = form.getFieldsValue();
    values.submit_type = submit_type;
    values.apiType = apiType;
    if (saveLoading || updateLoading) return;
    query.id ? updateDate(values) : runSave(values)

  };
  // 验证谷歌地图的事件
  const onGoogleAddress = () => {
    let value = form.getFieldValue('address');
    window.open('https://www.google.com/maps/search/?api=1&query=' + value);
  };
  // 添加商品的事件
  const onAddGoods = (goods_info) => {
    let oldGoods = form.getFieldValue("goods_info") || [];
    let goodsMap = new Map();     // 使用Map结构 确定商品呈现顺序

    oldGoods.forEach(og => goodsMap.set(og.sku, og))

    goods_info.forEach(newGoods => {
      if (!goodsMap.has(newGoods.sku)) {
        newGoods.num = 1;
        goodsMap.set(newGoods.sku, newGoods)
      }
    })

    goods_info = pluto.countPrice([...goodsMap.values()]);
    form.setFieldsValue({ goods_info });
  }

  const addGoods = () => {
    const country_id = form.getFieldValue('country_id');
    if (country_id) {
      _selectGoods.setVisible(true);
    } else {
      message.warn(formatMessage({ id: 'app.message.selectCountryFirst' }));
    }
  }
  return (
    <>
      <Card title={route.title} className="biz-card">
        <BizForm
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 10 }}
          onValuesChange={onValuesChange}
          footerLayout={{ span: 24 }}
          footerRight
          footer={
            <>
              <Button onClick={() => onFinish(2)}>
                {formatMessage({ id: 'app.global.save' })}
              </Button>
              <Button onClick={() => onFinish(1)} type="primary">
                {formatMessage({ id: 'app.global.submit' })}
              </Button>
            </>
          }
        >
          <BizForm.Partition
            title={formatMessage({ id: 'app.common.shippingAddress', defaultMessage: '收货地址' })}
          />
          <Row gutter={16}>
            <Col span={12}>
              <BizForm.Item
                name="customer_name"
                label={formatMessage({ id: 'app.common.fullName', defaultMessage: '姓名' })}
                rules={[
                  { required: true, message: formatMessage({ id: 'app.message.customerName' }) }
                ]}
              >
                <FieldInput />
              </BizForm.Item>
            </Col>
            <Col span={12}>
              <BizForm.Item
                name="tel"
                label={formatMessage({ id: 'app.common.phoneNumber', defaultMessage: '电话' })}
                rules={[
                  { required: true, message: formatMessage({ id: 'app.message.phoneNumber' }) }
                ]}
              >
                <Input />
              </BizForm.Item>
            </Col>
            <Col span={12}>
              <BizForm.Item
                name="language_id"
                label={formatMessage({ id: 'app.common.language', defaultMessage: '语言' })}
                rules={[
                  { required: true, message: formatMessage({ id: 'app.message.language' }) }
                ]}
              >
                <FieldSelect option={language?.list ?? []} mapValue="id" />
              </BizForm.Item>
            </Col>
            <Col span={12}>
              <BizForm.Item
                name="sms_verify_status"
                label={formatMessage({ id: 'app.common.messageStatus', defaultMessage: '短信验证' })}
              >
                <FieldText render={v => basic.formatDDIC(`order.sms_verify_status.${v}`, '-')} />
              </BizForm.Item>
            </Col>
            <Col span={12}>
              <BizForm.Item
                name="country_id"
                label={formatMessage({ id: 'app.common.country', defaultMessage: '国家' })}
                rules={[
                  { required: true, message: formatMessage({ id: 'app.message.country' }) }
                ]}
              >
                <FieldSelect option={country} mapValue="id" mapName="display_name" />
              </BizForm.Item>
            </Col>
            <Col span={12}>
              <BizForm.Item
                name="zone_prov_name"
                label={formatMessage({ id: 'app.common.province', defaultMessage: '省份' })}
                rules={[
                  { required: true, message: formatMessage({ id: 'app.message.province' }) }
                ]}
              >
                <AutoComplete options={province} />
              </BizForm.Item>
            </Col>
            <Col span={12}>
              <BizForm.Item
                name="zone_city_name"
                label={formatMessage({ id: 'app.common.city', defaultMessage: '城市' })}
                rules={[
                  { required: true, message: formatMessage({ id: 'app.message.city' }) }
                ]}
              >
                <AutoComplete options={city} />
              </BizForm.Item>
            </Col>
            <Col span={12}>
              <BizForm.Item
                name="zone_area_name"
                label={formatMessage({ id: 'app.common.region', defaultMessage: '地区' })}
                rules={[
                  { required: true, message: formatMessage({ id: 'app.message.region' }) }
                ]}
              >
                <AutoComplete options={district} />
              </BizForm.Item>
            </Col>
            <Col span={12}>
              <BizForm.Item
                name="address"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                label={formatMessage({ id: 'app.common.detailedAddress', defaultMessage: '详细地址' })}
                rules={[
                  { required: true, message: formatMessage({ id: 'app.message.address' }) }
                ]}
              >
                <FieldInput
                  suffix={
                    <Button onClick={onGoogleAddress} type="primary" ghost>
                      {formatMessage({ id: 'app.common.addressValidation', defaultMessage: '地址验证' })}
                    </Button>
                  }
                />
              </BizForm.Item>
            </Col>
            <Col span={12}>
              <BizForm.Item
                name="zip_code"
                label={formatMessage({ id: 'app.common.zipCode', defaultMessage: '邮编' })}
                rules={[
                  { required: true, message: formatMessage({ id: 'app.message.zipCode' }) }
                ]}
              >
                <AutoComplete options={zipCode} />
              </BizForm.Item>
            </Col>
            <Col span={24}>
              <BizForm.Item
                name="sale_remark"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 10 }}
                label={formatMessage({ id: 'app.common.customerRemark', defaultMessage: '客服备注' })}
              >
                <Input.TextArea />
              </BizForm.Item>
            </Col>
          </Row>
          <BizForm.Partition title={formatMessage({ id: 'app.common.addGoods', defaultMessage: '添加商品' })} />
          <_GoodsTable
            form={form}
            onAdd={() => addGoods()}
            deletable
            countryId={detail?.country?.id}
            addibleAction={['add', 'delete', 'received', 'discount', 'premium']}
            limitEditGoodsNum={isNeedLimitOrder}
            ignoreAmount={isNeedLimitOrder ? ['goods', 'premium', 'discount', 'advanced', 'collect'] : []} />
        </BizForm>
      </Card>
      {/* 选择收货地址 */}
      <_SelectGoods onOk={onAddGoods} form={form} />
    </>
  );
}
