import { history, useRequest, useIntl, useModel, useLocation } from 'umi'
import { Row, Col, Card, Button, Input } from 'antd'
import { BizForm, FieldText, _GoodsTable } from '@/components'
import { basic, pathToRegexp } from '@/utils'
import { useState } from 'react'
import services from '@/services'

export default function ({
  route,
  location,
  match
}) {
  const { formatMessage } = useIntl(); // 语言包国际化方案函数
  const [form] = BizForm.useForm()
  const {
    country,
    province,
    city,
    district,
    zipCode,
    setDepend
  } = useModel('cascade') // 城市省份简易的model

  // 1: "常规订单" 2: "补发订单" 3: "重发订单" 4: "线索订单"
  const { pathname } = useLocation();
  const isNeedLimitOrder = pathname.includes('/edit/replenish')
  const [detail, setDetail] = useState({})

  let apiType = pathToRegexp('/after-sales/order/:id/edit/:apiType?').exec(location.pathname)
  apiType = apiType[2] || ''
  // 查看原订单详情
  useRequest(services.afterSalesOrderDetail, {
    defaultParams: [{
      ...match.params,
      apiType: location.query.prefix ? apiType + location.query.prefix : apiType
    }],
    onSuccess: data => {
      setDepend(data)
      form.setFieldsValue(data)
    }
  })
  const { run: updateDate, loading: updateLoading } = useRequest(services.afterSalesOrderUpdate, {
    manual: true,
    onSuccess: () => {
      if (apiType === 'askforcancel') {
        history.push('/after-sales/order/askforcancel')
      } else {
        history.push('/after-sales/order/manual')
      }
    }
  })
  const onSubmit = (submit_type) => {
    let values = form.getFieldsValue(['id', 'sale_remark', 'goods_info'])
    values.submit_type = submit_type
    // values.apiType = apiType + '_able'
    values.apiType = location.query.prefix ? apiType + location.query.prefix : apiType
    !updateLoading && updateDate(values);
  }
  return (
    <Card title={route.title} className="biz-card">
      <BizForm
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        footerRight
        footer={
          <>
            <Button onClick={() => onSubmit(2)}>
              {formatMessage({ id: 'app.global.save' })}
            </Button>
            <Button type="primary" onClick={() => onSubmit(1)}>
              {formatMessage({ id: 'app.global.submit' })}
            </Button>
          </>
        }
      >
        {/**原订单信息 */}
        <>
          <BizForm.Partition title={formatMessage({ id: 'app.common.originalOrderInfo' })} />
          <Row gutter={16}>
            <Col span={6}>
              <BizForm.Item
                name="order_no"
                label={formatMessage({ id: 'app.common.orderNo', defaultMessage: '订单号' })}
              >
                <FieldText />
              </BizForm.Item>
            </Col>
            <Col span={6}>
              <BizForm.Item
                name="customer_name"
                label={formatMessage({ id: 'app.common.customerName', defaultMessage: '客户名称' })}
              >
                <FieldText />
              </BizForm.Item>
            </Col>
            <Col span={6}>
              <BizForm.Item
                name="tel"
                label={formatMessage({ id: 'app.common.phoneNumber', defaultMessage: '电话号码' })}
              >
                <FieldText />
              </BizForm.Item>
            </Col>
            <Col span={6}>
              <BizForm.Item
                name="order_time"
                label={formatMessage({ id: 'app.common.orderDate', defaultMessage: '订单时间' })}
              >
                <FieldText />
              </BizForm.Item>
            </Col>
            <Col span={6}>
              <BizForm.Item
                name="order_amount"
                label={formatMessage({ id: 'app.common.orderTotalAmount', defaultMessage: '订单总金额' })}
              >
                <FieldText />
              </BizForm.Item>
            </Col>
            <Col span={6}>
              <BizForm.Item
                name="order_status"
                label={formatMessage({ id: 'app.common.orderStatus', defaultMessage: '订单状态' })}
              >
                <FieldText render={v => basic.formatDDIC(`order.order_status.${v}`, '-')} />
              </BizForm.Item>
            </Col>
            <Col span={6}>
              <BizForm.Item
                name="shipping_status"
                label={formatMessage({ id: 'app.common.logisticsStatus', defaultMessage: '物流状态' })}
              >
                <FieldText render={v => basic.formatDDIC(`order.shipping_status.${v}`, '-')} />
              </BizForm.Item>
            </Col>
            <Col span={6}>
              <BizForm.Item
                name="goods_info"
                label={formatMessage({ id: 'app.common.number', defaultMessage: '数量' })}
              >
                <FieldText
                  render={v => Array.isArray(v) && v.length ? v.reduce((pre, next) => pre + next.num, 0) : '-'}
                />
              </BizForm.Item>
            </Col>
            <Col span={24}>
              <BizForm.Item
                name="goods_info"
                label={formatMessage({ id: 'app.common.goodsName', defaultMessage: '商品名称' })}
                labelCol={{ span: 2 }}
              >
                <FieldText render={v => Array.isArray(v) && v.map(d => d.internal_name).join(',')} />
              </BizForm.Item>
            </Col>
            <Col span={6}>
              <BizForm.Item
                name="sale_remark"
                label={formatMessage({ id: 'app.common.' + apiType }) + formatMessage({ id: 'app.common.remark' })}
              >
                <Input.TextArea />
              </BizForm.Item>
            </Col>
          </Row>
        </>
        {/**商品信息 */}
        {
          apiType !== 'askforcancel' && (
            <>
              <BizForm.Partition title={formatMessage({ id: 'app.common.goodsInfo' })} />
              <_GoodsTable
                form={form}
                ignoreColumns={['sell_price']}
                ignoreAction={['received_amount', 'discount_amount', 'premium_amount']}
                countryId={detail?.country?.id}
                limitEditGoodsNum={isNeedLimitOrder}
                ignoreAmount={isNeedLimitOrder ? ['goods', 'premium', 'discount', 'advanced', 'collect'] : []}
              />
            </>
          )
        }
      </BizForm>
    </Card>
  )
}
