import { history, useIntl, useRequest, useModel, Link } from 'umi'
import { Row, Col, Card, Button, Input, Table } from 'antd'
import {
  BizForm,
  FieldText,
  _GoodsTable,
  _MakeCall,
  _OrderLogistics,
  TimeAxis,
} from '@/components';
import { basic, pathToRegexp, numeral } from '@/utils'
import services from '@/services'

const itemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}
const otherLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
const basicBlock = [
  'original',
  'audited',
  'audit',
  'distributed',
  'distribute_not',
  'manual',
  'invalid',
  'repeat',
  'abnormal',
  'replenish',
  'redelivery',
  'abnormal_redelivery'
]
const originalOrderBlock = ['replenish', 'redelivery', 'askforcancel', 'abnormal_redelivery']
export default function ({
  route,
  match,
  location
}) {

  let { formatMessage } = useIntl(); // 语言包国际化方案函数
  let [form] = BizForm.useForm()
  let { makeCall } = useModel('call')
  let { _logistics } = useModel('modal')
  const {
    country,
    province,
    city,
    district,
    zipCode,
    setDepend
  } = useModel('cascade') // 城市省份简易的model
  let { query, pathname } = location
  let apiType = pathToRegexp('/pre-sales/order/:id/detail/:apiType?').exec(pathname)
  apiType = apiType[2] || 'original'
  let { run: runUpdate } = useRequest(services.preSalesOrderUpdate, {
    manual: true,
    onSuccess: (data, [params]) => {
      if (params.apiType === 'audit') {
        if (params.audit_status == '1') {
          history.push('/pre-sales/order/audited')
        }
        if (params.audit_status == '-1') {
          history.push('/pre-sales/order/reject')
        }
      }
      if (params.apiType === 'abnormal') {
        history.push('/pre-sales/order/abnormal_dealwith')
      }
    }
  })
  let { data: optData, run: runRecord } = useRequest(services.orderRecord, {
    manual: true
  })

  let { data: detail } = useRequest(services.preSalesOrderDetail, {
    defaultParams: [{ apiType, ...match.params }],
    onSuccess: ({ source_order_info, ...data }) => {
      data.source_order = [data.source_order]
      data = _.omit(data, 'goods_info')
      apiType !== 'askforcancel' && runRecord({ id: data.order_id })
      setDepend(data)
      form.setFieldsValue(data)
    }
  })
  const extraCopywriting = ['replenish', 'redelivery'].includes(apiType) ? formatMessage({ id: 'app.common.' + apiType }) : ''
  const onSubmit = (submit_type, audit_status) => {
    let values = form.getFieldsValue(['id', 'abnormal_remark'])
    if (query.action === 'audit') {
      values.audit_status = audit_status
      values.apiType = query.action
    } else {
      values.submit_type = submit_type
      values.apiType = query.action
    }
    runUpdate(values)
  }
  const onMakeCall = () => {
    let value = form.getFieldsValue(['tel', 'customer_name'])
    value.order_no = detail.order_no
    makeCall(value)
  }

  // 1: "常规订单" 2: "补发订单" 3: "重发订单" 4: "线索订单"
  const isNeedLimitOrder = [2].includes(detail?.order_second_type)
  return (
    <Card title={route.title} className="biz-card">
      <_MakeCall />
      <_OrderLogistics />
      <BizForm
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        footerRight
        footer={
          'action' in query &&
          <>
            <Button onClick={() => onSubmit(2, -1)}>
              {
                formatMessage({ id: query.action === 'audit' ? 'app.common.reject' : 'app.global.save' })
              }
            </Button>
            <Button type="primary" onClick={() => onSubmit(1, 1)}>
              {
                formatMessage({ id: query.action === 'audit' ? 'app.common.audit' : 'app.global.submit' })
              }
            </Button>
          </>
        }
      >
        {/**原订单信息 */}
        {
          originalOrderBlock.includes(apiType) &&
          <>
            <BizForm.Partition
              title={formatMessage({ id: 'app.common.originalOrderInfo', defaultMessage: '原订单信息' })}
            />
            <BizForm.Item name="source_order" valuePropName="dataSource" noStyle>
              <Table
                style={{ marginTop: 16, marginBottom: 16 }}
                pagination={false}
                rowKey="id"
                locale={{ emptyText: ' ' }}
                columns={[
                  {
                    title: formatMessage({ id: 'app.common.orderNo', defaultMessage: '订单号' }),
                    width: 180,
                    dataIndex: 'order_no'
                  },
                  {
                    title: formatMessage({ id: 'app.common.customerName', defaultMessage: '客户名称' }),
                    key: 'customer_name',
                    dataIndex: 'customer_name'
                  },
                  {
                    title: formatMessage({ id: 'app.common.phoneNumber', defaultMessage: '电话号码' }),
                    width: 150,
                    dataIndex: 'tel',
                    render: v => basic.getSecretTelNum(v)
                  },
                  {
                    title: formatMessage({ id: 'app.common.goodsName', defaultMessage: '商品名称' }),
                    width: 200,
                    dataIndex: 'goods_info',
                    render: v => Array.isArray(v) && v.map(g => (<div key={g.id}>{g.internal_name}</div>))
                  },
                  {
                    title: formatMessage({ id: 'app.common.number', defaultMessage: '数量' }),
                    width: 80,
                    dataIndex: 'goods_info',
                    render: v => Array.isArray(v) && v.reduce((p, c) => p + c.num, 0)
                  },
                  {
                    title: formatMessage({ id: 'app.common.orderTotalAmount', defaultMessage: '订单总金额' }),
                    width: 150,
                    dataIndex: 'order_amount',
                    render: v => numeral(v).format('0,0.00'),
                  },
                  {
                    title: formatMessage({ id: 'app.common.orderStatus', defaultMessage: '订单状态' }),
                    width: 120,
                    dataIndex: 'order_status',
                    render: v => basic.formatDDIC(`order.order_status.${v}`, '-')
                  },
                  {
                    title: formatMessage({ id: 'app.common.logisticsStatus', defaultMessage: '物流状态' }),
                    width: 120,
                    dataIndex: 'shipping_status',
                    render: v => basic.formatDDIC(`order.shipping_status.${v}`, '-')
                  },
                  {
                    title: formatMessage({ id: 'app.common.orderDate', defaultMessage: '订单时间' }),
                    width: 200,
                    dataIndex: 'order_time'
                  },
                  {
                    title: formatMessage({ id: 'app.global.see', defaultMessage: '查看' }),
                    width: 80,
                    render: d => <Link to={`/pre-sales/order/${d.id}/detail`}>{formatMessage({ id: 'app.common.orderDetail', defaultMessage: '订单详情' })}</Link>
                  }

                ]}
              />
            </BizForm.Item>
            <Row gutter={16}>
              <Col span={6}>
                <BizForm.Item
                  name="source-remark"
                  label={extraCopywriting + formatMessage({ id: 'app.common.remark', defaultMessage: '备注' })}
                >
                  <FieldText />
                </BizForm.Item>
              </Col>
              {
                apiType === 'askforcancel' &&
                <Col span={24}>
                  <BizForm.Item
                    name="opt_result"
                    label={formatMessage({ id: 'app.common.cancelStatus', defaultMessage: '取消状态' })}
                    labelCol={{ span: 2 }}
                  >
                    <FieldText render={v => basic.formatDDIC(`order.opt_result.${v}`, '-')} />
                  </BizForm.Item>
                </Col>
              }

            </Row>
          </>
        }
        {/** 订单信息 */}
        {
          basicBlock.includes(apiType) &&
          <>
            <BizForm.Partition
              title={extraCopywriting + formatMessage({ id: 'app.common.orderInfo', defaultMessage: '订单信息' })}
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
              {/** 控制哪些路由参数不显示 */}
              {
                !['replenish', 'redelivery'].includes(apiType) &&
                <Col span={6}>
                  <BizForm.Item
                    name="replenish_redelivery_status"
                    className="interval-item"
                    label={formatMessage({ id: 'app.common.compensationStatus', defaultMessage: '补重状态' })}
                  >
                    <FieldText render={v => basic.formatDDIC(`order.replenish_redelivery_status.${v}`, '-')} />
                  </BizForm.Item>
                </Col>
              }
              {/** 控制哪些路由参数不显示 */}
              {
                !['replenish', 'redelivery'].includes(apiType) &&
                <Col span={6}>
                  <BizForm.Item
                    name="replenish_redelivery_order_no"
                    className="interval-item"
                    label={formatMessage({ id: 'app.common.compensationTrackingNo', defaultMessage: '补重订单号' })}
                  >
                    <FieldText />
                  </BizForm.Item>
                </Col>
              }
            </Row>
          </>
        }
        {/** 收货信息 */}
        {
          basicBlock.includes(apiType) &&
          <>
            <BizForm.Partition
              title={formatMessage({ id: 'app.common.receivingInfo', defaultMessage: '收货信息' })}
            />
            <Row gutter={16}>
              <Col span={12}>
                <BizForm.Item
                  name="customer_name"
                  className="interval-item"
                  label={formatMessage({ id: 'app.common.fullName', defaultMessage: '姓名' })}
                  {...itemLayout}
                >
                  <FieldText />
                </BizForm.Item>
              </Col>
              <Col span={12}>
                <BizForm.Item
                  name="tel"
                  className="interval-item"
                  label={formatMessage({ id: 'app.common.phoneNumber', defaultMessage: '电话' })}
                  {...itemLayout}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 8 }}
                >
                  <FieldText
                    render={v => basic.getSecretTelNum(v)}
                    suffix={
                      <Button type="primary" onClick={onMakeCall} ghost>
                        拨打电话
                      </Button>
                    }
                  />
                </BizForm.Item>
              </Col>
              <Col span={12}>
                <BizForm.Item
                  name={['language', 'display_name']}
                  className="interval-item"
                  label={formatMessage({ id: 'app.common.language', defaultMessage: '语言' })}
                  {...itemLayout}
                >
                  <FieldText />
                </BizForm.Item>
              </Col>
              <Col span={12}>
                <BizForm.Item
                  name="sms_verify_status"
                  className="interval-item"
                  label={formatMessage({ id: 'app.common.messageStatus', defaultMessage: '短信验证' })}
                  {...itemLayout}
                >
                  <FieldText render={v => basic.formatDDIC(`order.sms_verify_status.${v}`, '-')} />
                </BizForm.Item>
              </Col>
              <Col span={12}>
                <BizForm.Item
                  name={['country', 'display_name']}
                  className="interval-item"
                  label={formatMessage({ id: 'app.common.country', defaultMessage: '国家' })}
                  {...itemLayout}
                >
                  <FieldText />
                </BizForm.Item>
              </Col>
              <Col span={12}>
                <BizForm.Item
                  name="zone_prov_name"
                  className="interval-item"
                  label={formatMessage({ id: 'app.common.province', defaultMessage: '省份' })}
                  {...itemLayout}
                >
                  <FieldText />
                </BizForm.Item>
              </Col>
              <Col span={12}>
                <BizForm.Item
                  name="zone_city_name"
                  className="interval-item"
                  label={formatMessage({ id: 'app.common.city', defaultMessage: '城市' })}
                  {...itemLayout}
                >
                  <FieldText />
                </BizForm.Item>
              </Col>
              <Col span={12}>
                <BizForm.Item
                  name="zone_area_name"
                  className="interval-item"
                  label={formatMessage({ id: 'app.common.region', defaultMessage: '地区' })}
                  {...itemLayout}
                >
                  <FieldText />
                </BizForm.Item>
              </Col>
              <Col span={12}>
                <BizForm.Item
                  name="address"
                  className="interval-item"
                  label={formatMessage({ id: 'app.common.detailedAddress', defaultMessage: '详细地址' })}
                  {...itemLayout}
                >
                  <FieldText />
                </BizForm.Item>
              </Col>
              <Col span={12}>
                <BizForm.Item
                  name="zip_code"
                  className="interval-item"
                  label={formatMessage({ id: 'app.common.zipCode', defaultMessage: '邮编' })}
                  {...itemLayout}
                >
                  <FieldText />
                </BizForm.Item>
              </Col>
              <Col span={12}>
                <BizForm.Item
                  name="pre_opt_remark"
                  className="interval-item"
                  label={formatMessage({ id: 'app.common.customerRemark', defaultMessage: '客服备注' })}
                  {...itemLayout}
                >
                  <FieldText render={v => v || '-'} />
                </BizForm.Item>
              </Col>
            </Row>
          </>
        }
        {/**商品信息 */}
        {
          basicBlock.includes(apiType) &&
          <>
            <BizForm.Partition
              title={formatMessage({ id: 'app.common.goodsInfo', defaultMessage: '商品信息' })}
            />
            <_GoodsTable
              goodsInfo={detail?.goods_info ?? []}
              countryId={detail?.country?.id}
              form={form}
              isPromotion={apiType === 'audited'}
              limitEditGoodsNum={isNeedLimitOrder}
              ignoreAmount={isNeedLimitOrder ? ['goods', 'premium', 'discount', 'advanced', 'collect'] : []}
              disabled
              greenShot
            />
          </>
        }
        {
          basicBlock.includes(apiType) &&
          <>
            <BizForm.Partition
              title={formatMessage({ id: 'app.common.serviceInfo', defaultMessage: '客服信息' })}
            />
            <Row gutter={16}>
              <Col span={12}>
                <BizForm.Item
                  name={['pre_sale', 'real_name']}
                  className="interval-item"
                  label={formatMessage({ id: 'app.common.preSaleService', defaultMessage: '售前客服' })}
                  {...otherLayout}
                >
                  <FieldText />
                </BizForm.Item>
              </Col>
              <Col span={12}>
                <BizForm.Item
                  name={['after_sale', 'real_name']}
                  className="interval-item"
                  label={formatMessage({ id: 'app.common.afterSaleService', defaultMessage: '售后客服' })}
                  {...otherLayout}
                >
                  <FieldText />
                </BizForm.Item>
              </Col>
              <Col span={12}>
                <BizForm.Item
                  name="pre_opt_type"
                  className="interval-item"
                  label={formatMessage({ id: 'app.common.preSaleHandle', defaultMessage: '售前处理' })}
                  {...otherLayout}
                >
                  <FieldText render={v => basic.formatDDIC(`order.pre_opt_type.${v}`, '-')} />
                </BizForm.Item>
              </Col>
              <Col span={12}>
                <BizForm.Item
                  name="after_opt_type"
                  className="interval-item"
                  label={formatMessage({ id: 'app.common.afterSaleHandle', defaultMessage: '售后处理' })}
                  {...otherLayout}
                >
                  <FieldText render={v => basic.formatDDIC(`order.pre_opt_type.${v}`, '-')} />
                </BizForm.Item>
              </Col>
              <Col span={12}>
                <BizForm.Item
                  label={formatMessage({ id: 'app.common.abnormalRemark', defaultMessage: '异常备注' })}
                  {...otherLayout}
                >
                  {
                    query.action === 'abnormal' ?
                      <>
                        <BizForm.Item name="abnormal_remark" noStyle>
                          <FieldText />
                        </BizForm.Item>
                        <Input.Group>
                          <Row gutter={8}>
                            <Col span={12}>
                              <BizForm.Item name="service_remark" noStyle>
                                <Input.TextArea />
                              </BizForm.Item>
                            </Col>
                            <Col span={6}>
                              <Button type="primary" ghost onClick={() => _logistics.setVisible(true)}>
                                {formatMessage({ id: 'app.common.viewAbnormalOrderLogistics', defaultMessage: '查看异常订单物流信息' })}
                              </Button>
                            </Col>
                          </Row>
                        </Input.Group>
                      </>
                      : <BizForm.Item name="service_remark" noStyle>
                        <FieldText />
                      </BizForm.Item>
                  }
                </BizForm.Item>
              </Col>
            </Row>
          </>
        }
        {
          apiType !== 'askforcancel' &&
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
                      {/* {item.remark &&
                        <div>
                          {formatMessage({ id: 'app.common.customerRemark' })}：{item.remark}
                        </div>
                      } */}
                      <div>
                        {item.opt_type_name}
                      </div>
                    </>
                  )}
                />
              </Col>
            </Row>
          </>
        }
      </BizForm>
    </Card>
  )
}
