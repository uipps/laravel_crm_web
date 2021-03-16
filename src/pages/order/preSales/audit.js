import { useState, useRef } from 'react'
import { Redirect, history, useIntl, useRequest, useModel } from 'umi'
import { Row, Col, Card, Button, Input, AutoComplete } from 'antd'
import {
  BizForm,
  FieldText,
  FieldInput,
  FieldSelect,
  _GoodsTable,
  Dialog,
  _MakeCall,
  TimeAxis
} from '@/components'
import { _, basic, pathToRegexp, pluto } from '@/utils'
import services from '@/services'

const itemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 }
}
export default function ({
  route,
  match,
  location
}) {
  let { formatMessage } = useIntl(); // 语言包国际化方案函数
  let [form] = BizForm.useForm()
  const {
    country,
    province,
    city,
    district,
    zipCode,
    setDepend
  } = useModel('cascade') // 城市省份简易的model
  let { language } = useModel('common')
  let { makeCall } = useModel('call')
  let { initialState } = useModel('@@initialState');
 
  const [isSubmit, setSubmit] = useState(false)
  const [isEiditing, setIsEiditing] = useState(false)
  const [editable, setEditable] = useState(true) //电话的可编辑状态

  if ((initialState?.account?.level ?? 1) === 1) {
    // 主管没有编辑权限所以跳转到详情页面
    return <Redirect to={`/pre-sales/order/${match.params.id}/detail/audit`} />
  }

  let { run: runDetail, data: detail } = useRequest(services.preSalesOrderDetail, {
    defaultParams: [{ ...match.params, apiType: 'audit_not' }],
    onSuccess: (data) => {
      data = basic.toFormData(data, { transform: 'sms_verify_status' });
      data = _.omit(data, 'goods_info')
      setDepend(data)
      runRecord({ id: data.order_id })
      form.setFieldsValue(data)

    }
  })
  let { run: runUpdate, loading: updateLoading } = useRequest(services.preSalesOrderUpdate, {
    manual: true,
    onSuccess: (data, [params]) => {
      if (params.submit_type == 2) {
        history.push('/pre-sales/order/audit_not')
      } else {
        history.push('/pre-sales/order/audited')
      }
    }
  })
  let { data: optData, run: runRecord } = useRequest(services.orderRecord, { manual: true })
  const onGoogleAddress = () => {
    let value = form.getFieldValue('address');
    window.open('https://www.google.com/maps/search/?api=1&query=' + value);
  };
  // form 表单改变时
  const onValuesChange = (value) => {
    setDepend(value)
    if ('pre_opt_type' in value) {
      let submitList = ['20', '21', '22', '23']
      if (submitList.includes(value.pre_opt_type)) {
        setSubmit(true)
      } else {
        setSubmit(false)
      }
    }
    if('tel' in value){
      setIsEiditing(true);
    }
  };
  const onFinish = async (submit_type) => {
    let values = await form.validateFields()
    values.apiType = 'audit'
    values.goods_info = pluto.filter(values.goods_info)
    values.submit_type = submit_type;
    !updateLoading && runUpdate(values)
  }
  const onCancelPhone = () => {
    form.setFieldsValue({ tel: detail.tel })
    setEditable(true)
  }
  const onSavePhone = () => {
    setEditable(true);
    setIsEiditing(false);
  }
  const onMakeCall = () => {
    let value = form.getFieldsValue(['tel', 'customer_name'])
    value.order_no = detail.order_no
    makeCall(value)
  }
  

  return (
    <Card title={route.title} className="biz-card">
      <_MakeCall />
      <BizForm
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onValuesChange={onValuesChange}
        footerRight
        footer={
          <>
            <Button onClick={() => onFinish(2)}>
              {formatMessage({ id: 'app.global.save' })}
            </Button>
            <Button type="primary" onClick={() => onFinish(1)} disabled={isSubmit}>
              {formatMessage({ id: 'app.global.submit' })}
            </Button>
          </>
        }
      >
        {/** 订单信息 */}
        <>
          <BizForm.Partition
            title={formatMessage({ id: 'app.common.orderInfo', defaultMessage: '订单信息' })}
          />
          <Row gutter={16}>
            <Col span={6}>
              <BizForm.Item
                name="order_no"
                className="interval-item"
                label={formatMessage({ id: 'app.common.orderNo', defaultMessage: '订单号' })}
              >
                <FieldText />
              </BizForm.Item>
            </Col>
            <Col span={6}>
              <BizForm.Item
                name="ship_no"
                className="interval-item"
                label={formatMessage({ id: 'app.common.trackingNo', defaultMessage: '运单号' })}
              >
                <FieldText />
              </BizForm.Item>
            </Col>
            <Col span={6}>
              <BizForm.Item
                name="order_type"
                className="interval-item"
                label={formatMessage({ id: 'app.common.underOrderType', defaultMessage: '下单类型' })}
              >
                <FieldText render={v => basic.formatDDIC(`order.order_type.${v}`, '-')} />
              </BizForm.Item>
            </Col>
            <Col span={6}>
              <BizForm.Item
                name="order_status"
                className="interval-item"
                label={formatMessage({ id: 'app.common.orderStatus', defaultMessage: '订单状态' })}
              >
                <FieldText render={v => basic.formatDDIC(`order.order_status.${v}`, '-')} />
              </BizForm.Item>
            </Col>
            <Col span={6}>
              <BizForm.Item
                name="order_time"
                className="interval-item"
                label={formatMessage({ id: 'app.common.underOrderTime', defaultMessage: '下单时间' })}
              >
                <FieldText />
              </BizForm.Item>
            </Col>
            <Col span={6}>
              <BizForm.Item
                name="ship_line"
                className="interval-item"
                label={formatMessage({ id: 'app.common.logisticsLines', defaultMessage: '物流线路' })}
              >
                <FieldText />
              </BizForm.Item>
            </Col>
            <Col span={6}>
              <BizForm.Item
                name="ship_wherehouse"
                className="interval-item"
                label={formatMessage({ id: 'app.common.deliverStore', defaultMessage: '发货仓库' })}
              >
                <FieldText />
              </BizForm.Item>
            </Col>
            <Col span={6}>
              <BizForm.Item
                name="ship_time"
                className="interval-item"
                label={formatMessage({ id: 'app.common.exportTime', defaultMessage: '出库时间' })}
              >
                <FieldText />
              </BizForm.Item>
            </Col>
            <Col span={6}>
              <BizForm.Item
                name="shipping_status"
                className="interval-item"
                label={formatMessage({ id: 'app.common.logisticsStatus', defaultMessage: '物流状态' })}
              >
                <FieldText render={v => basic.formatDDIC(`order.shipping_status.${v}`, '-')} />
              </BizForm.Item>
            </Col>
            <Col span={6}>
              <BizForm.Item
                name="replenish_redelivery_status"
                className="interval-item"
                label={formatMessage({ id: 'app.common.compensationStatus', defaultMessage: '补重状态' })}
              >
                <FieldText />
              </BizForm.Item>
            </Col>

            <Col span={6}>
              <BizForm.Item
                name="replenish_redelivery_order_no"
                className="interval-item"
                label={formatMessage({ id: 'app.common.compensationTrackingNo', defaultMessage: '补重订单号' })}
              >
                <FieldText />
              </BizForm.Item>
            </Col>
          </Row>
        </>

        {/** 收货信息 */}
        <>
          <BizForm.Partition
            title={formatMessage({ id: 'app.common.receivingInfo', defaultMessage: '收货信息' })}
          />
          <Row gutter={16}>
            <Col span={12}>
              <BizForm.Item
                name="customer_name"
                label={formatMessage({ id: 'app.common.fullName', defaultMessage: '姓名' })}
                {...itemLayout}
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
                {...itemLayout}

                rules={[
                  { required: true, message: formatMessage({ id: 'app.message.phoneNumber' }) }
                ]}
              >
                <FieldInput
                  render = {v => basic.getSecretTelNum(v, editable, isEiditing)}
                  onFocus = {(e) => {
                    e.persist();
                    e.target.select();
                  }}
                  suffix={
                    <>
                      <Button
                        onClick={() => editable ? onMakeCall() : onSavePhone()}
                        style={{ marginRight: 4 }}
                        type="primary"
                        ghost
                      >
                        {formatMessage({ id: editable ? 'app.common.makeCalls' : 'app.global.save' })}
                      </Button>
                      <Button
                        onClick={() => !editable ? onCancelPhone() : setEditable(false)}
                        type="primary"
                        ghost
                      >
                        {formatMessage({ id: editable ? 'app.common.modifyPhone' : 'app.global.cancel' })}
                      </Button>
                    </>
                  }
                  disabled={editable}
                />
              </BizForm.Item>
            </Col>
            <Col span={12}>
              <BizForm.Item
                name="language_id"
                label={formatMessage({ id: 'app.common.language', defaultMessage: '语言' })}
                {...itemLayout}
                rules={[
                  { required: true, message: formatMessage({ id: 'app.message.language' }) }
                ]}
              >
                <FieldSelect option={language} mapValue="id" />
              </BizForm.Item>
            </Col>
            <Col span={12}>
              <BizForm.Item
                name="sms_verify_status"
                label={formatMessage({ id: 'app.common.messageStatus', defaultMessage: '短信验证' })}
                {...itemLayout}
              >
                <FieldText render={v => basic.formatDDIC(`order.sms_verify_status.${v}`, '-')} />
              </BizForm.Item>
            </Col>
            <Col span={12}>
              <BizForm.Item
                name="country_id"
                label={formatMessage({ id: 'app.common.country', defaultMessage: '国家' })}
                {...itemLayout}
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
                {...itemLayout}
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
                {...itemLayout}
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
                {...itemLayout}
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
                label={formatMessage({ id: 'app.common.detailedAddress', defaultMessage: '详细地址' })}
                {...itemLayout}
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
                {...itemLayout}
                rules={[
                  { required: true, message: formatMessage({ id: 'app.message.zipCode' }) }
                ]}
              >
                <AutoComplete options={zipCode} />
              </BizForm.Item>
            </Col>
            <Col span={12}>
              <BizForm.Item
                name="pre_opt_remark"
                label={formatMessage({ id: 'app.common.customerRemark', defaultMessage: '客服备注' })}
                {...itemLayout}
              >
                <Input.TextArea />
              </BizForm.Item>
            </Col>
          </Row>
        </>
        {/**商品信息 */}
        <>
          <BizForm.Partition
            title={formatMessage({ id: 'app.common.goodsInfo', defaultMessage: '商品信息' })}
          />
           <_GoodsTable
              goodsInfo={detail?.goods_info ?? []}
              form={form}
              isPromotion={true}
              countryId={detail?.country?.id}
              addibleAction={['received']}
              ignoreAmount={['premium']}
              disabled={detail?.package_flag === 1}
              assets={detail}
          />

        </>
        <>
          <BizForm.Partition
            title={formatMessage({ id: 'app.common.serviceInfo', defaultMessage: '客服信息' })}
          />
          <Row gutter={16}>
            <Col span={12}>
              <BizForm.Item
                name={['pre_sale', 'real_name']}
                label={formatMessage({ id: 'app.common.preSaleService', defaultMessage: '售前客服' })}
                {...itemLayout}
              >
                <FieldText />
              </BizForm.Item>
            </Col>
            <Col span={12}>
              <BizForm.Item
                name={['after_sale', 'real_name']}
                label={formatMessage({ id: 'app.common.afterSaleService', defaultMessage: '售后客服' })}
                {...itemLayout}
              >
                <FieldText />
              </BizForm.Item>
            </Col>
            <Col span={12}>
              <BizForm.Item
                name="pre_opt_type"
                label={formatMessage({ id: 'app.common.preSaleHandle', defaultMessage: '售前处理' })}
                {...itemLayout}
                rules={[
                  { required: true, message: formatMessage({ id: 'app.message.result' }) }
                ]}
              >
                <FieldSelect option={basic.formatDDIC('order.pre_opt_type', true)} mapName="label" />
              </BizForm.Item>
            </Col>
            <Col span={12}>
              <BizForm.Item
                name="after_opt_type"
                label={formatMessage({ id: 'app.common.afterSaleHandle', defaultMessage: '售后处理' })}
                {...itemLayout}
              >
                <FieldText render={v => basic.formatDDIC(`order.order_status.${v}`, '-')} />
              </BizForm.Item>
            </Col>
            <Col span={12}>
              <BizForm.Item
                name="abnormal_remark"
                label={formatMessage({ id: 'app.common.abnormalRemark', defaultMessage: '异常备注' })}
                {...itemLayout}
              >
                <FieldText />
              </BizForm.Item>
            </Col>
          </Row>
        </>
        <>
          <BizForm.Partition title={formatMessage({ id: 'app.common.orderActionHistory', defaultMessage: '订单操作记录' })} />
          <Row>
            <Col span={24}>
              <TimeAxis
                dataSource={optData?.list ?? []}
                label="opt_time"
                wrapper={(item) => (
                  <>
                    {item.operator?.real_name &&
                    <div>
                      {item.operator?.role?.name}：{item.operator?.real_name}
                    </div>
                    }
                    {item.remark &&
                    <div>
                      {item.remark}
                    </div>
                    }
                    <div>
                      {item.opt_type_name}
                    </div>
                  </>
                )}
              />
            </Col>
          </Row>
        </>
      </BizForm>
    </Card>
  )
}
