import styles from '../styles/manual.less';
import { useState } from 'react';
import { useIntl, useRequest, useModel } from 'umi';

import { Card, Row, Col, Input, Button, AutoComplete, message } from 'antd';

import {
  BizForm,
  FieldSelect,
  FieldInput,
  FieldText,
  _GoodsTable,
  _SelectCustomer,
  _SelectService,
  _SelectGoods
} from '@/components';

import services from '@/services';
import { basic, _, pluto } from '@/utils';
const preServices = services.pre;
export default function ({
  route,
  history,
  location
}) {
  const [form] = BizForm.useForm();
  const { formatMessage } = useIntl(); // 语言包国际化方案函数
  const [serviceNeedLangIds, setServiceNeedLangIds] = useState([]);
  const [selectedService, setSelectedService] = useState({});
  const { _selectCustomer, _selectGoods, _selectService } = useModel('modal'); // 连接简易的model模型
  const {
    country,
    province,
    city,
    district,
    zipCode,
    setDepend
  } = useModel('cascade') // 城市省份简易的model
  const query = location.query
  let { data: detail } = useRequest(services.preSalesOrderDetail, {
    defaultParams: [{ apiType: 'manual', ...query }],
    manual: !query.id,
    onSuccess: (data) => {
      data = basic.toFormData(data, { transform: 'sms_verify_status' });
      data.pre_sale_name = data.pre_sale?.real_name;
      form.setFieldsValue(data)
      setDepend(data)
      setServiceNeedLangIds([data.language_id])
    }
  })
  const { run: updateDate, loading: updateLoading } = useRequest(services.preSalesOrderUpdate, {
    manual: true,
    onSuccess: () => {
      history.push('/pre-sales/order/manual')
    }
  })
  const { run: runSave, loading: saveLoading } = useRequest(services.preSalesCreate, {
    manual: true,
    onSuccess: () => history.push('/pre-sales/order/manual'),
  }); //添加保存手工单
  let { data: language } = useRequest(services.queryLangs); // 异步加载语言

  // form 表单改变时
  const onValuesChange = (value) => {
    if (value.language_id) {
      let { language_id } = value;
      setServiceNeedLangIds([language_id])
    }
    setDepend(value)
    if(value.country_id){
      form.setFieldsValue({ goods_info :[] });
    }
   
  };

  // 1: "常规订单" 2: "补发订单" 3: "重发订单" 4: "线索订单"
  const isNeedLimitOrder = [2].includes(detail?.order_second_type)

  const onFinish = async submit_type => {
    let values = await form.validateFields()
    let customerLang = values.language_id;
    values.submit_type = submit_type;
    values.apiType = query.id ? 'manual' : 'general'
    if (saveLoading || updateLoading) return;
    query.id ? updateDate(values) : runSave(values)
  };
  // 验证谷歌地图的事件
  const onGoogleAddress = () => {
    let value = form.getFieldValue('address');
    window.open('https://www.google.com/maps/search/?api=1&query=' + value);
  };
  // 添加商品的事件
  const onGoodsOk = (goods_info) => {
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
  const chooseService = () => {
    if (serviceNeedLangIds.length > 0 && form.getFieldValue('customer_name')) {
      _selectService.setVisible(true)
    } else {
      message.warn(formatMessage({ id: 'app.message.selectCustomerFirst' }));
      return false
    }
  }
  const onServiceOk = (values) => {
    let result = {
      pre_sale_name: values.name,
      pre_sale_id: values.id
    }
    setSelectedService({ ...values });
    form.setFieldsValue(result)
  }
  const onCustomerOk = record => {
    let data = basic.toFormData(_.omit(record, 'id'), {});
    let { language_id } = data;
    setServiceNeedLangIds([language_id])
    setDepend(data)
    form.setFieldsValue(data);
  };

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
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          onValuesChange={onValuesChange}
          fake={['id', 'pre_sale_id']}
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
                <FieldInput
                  suffix={
                    <Button
                      onClick={() => _selectCustomer.setVisible(true)}
                      type="primary"
                      ghost
                    >
                      {formatMessage({ id: 'app.common.selectUser' })}
                    </Button>
                  }
                />
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
            <Col span={12}>
              <BizForm.Item
                name="pre_sale_name"
                label={formatMessage({ id: 'app.common.preSaleService', defaultMessage: '售前客服' })}
                rules={[
                  { required: true, message: formatMessage({ id: 'app.message.selectCustomer' }) }
                ]}
              >
                <FieldInput
                  disabled
                  suffix={
                    <Button
                      onClick={() => { chooseService() }}
                      type="primary"
                      ghost
                    >
                      {formatMessage({ id: 'app.common.selectService', defaultMessage: '选择客服' })}
                    </Button>
                  }
                />
              </BizForm.Item>
            </Col>
            <Col span={24}>
              <BizForm.Item
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 10 }}
                name="sale_remark"
                label={formatMessage({ id: 'app.common.customerRemark', defaultMessage: '客服备注' })}
              >
                <Input.TextArea />
              </BizForm.Item>
            </Col>
          </Row>
          <BizForm.Partition title={formatMessage({ id: 'app.common.addGoods', defaultMessage: '添加商品' })} />
          <_GoodsTable
            form={form}
            countryId={detail?.country?.id}
            limitEditGoodsNum={isNeedLimitOrder}
            ignoreAmount={isNeedLimitOrder ? ['goods', 'premium', 'discount', 'advanced', 'collect'] : []}
            onAdd={() => addGoods()}
            addibleAction={['add', 'delete', 'received', 'discount', 'premium']}
          />
        </BizForm>
      </Card>
      <_SelectGoods onOk={onGoodsOk} form={form}/>
      <_SelectService
        onSubmit={onServiceOk}
        serviceNeedLangIds={serviceNeedLangIds}
        title={formatMessage({ id: 'app.common.selectService' })}
        desc={formatMessage({ id: 'app.message.orderAllocation' })}
      />
      <_SelectCustomer onOk={onCustomerOk} />
    </>
  );
}
