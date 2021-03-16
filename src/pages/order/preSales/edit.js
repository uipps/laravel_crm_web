import { Link, history, useRequest, useIntl, useModel, useLocation } from 'umi'
import { Row, Col, Card, Button, Input, Table } from 'antd'
import { BizForm, FieldText, _GoodsTable } from '@/components'
import { basic, pathToRegexp } from '@/utils'
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

  let apiType = pathToRegexp('/pre-sales/order/:id/edit/:apiType?').exec(location.pathname)
  apiType = apiType[2] || ''
  // 查看原订单详情
  const { data: detail } = useRequest(services.preSalesOrderDetail, {
    defaultParams: [{
      ...match.params,
      apiType: location.query.prefix ? apiType + location.query.prefix : apiType
    }],
    onSuccess: data => {
      data.source_order = [data]
      setDepend(data)
      form.setFieldsValue(data)
    }
  })
  const { run: updateDate, loading: updateLoading } = useRequest(services.preSalesOrderUpdate, {
    manual: true,
    onSuccess: () => {
      if (apiType === 'askforcancel') {
        history.push('/pre-sales/order/askforcancel')
      } else {
        history.push('/pre-sales/order/manual')
      }
    }
  })
  const onSubmit = (submit_type) => {
    let values = form.getFieldsValue(['id', 'remark', 'goods_info'])
    values.submit_type = submit_type
    values.apiType = location.query.prefix ? apiType + location.query.prefix : apiType
    !updateLoading && updateDate(values)
  }


  // 1: "常规订单" 2: "补发订单" 3: "重发订单" 4: "线索订单"
  const { pathname } = useLocation(); 
  const isNeedLimitOrder = pathname.includes('/edit/replenish')
  return (
    <Card title={route.title} className="biz-card">
      <BizForm
        form={form}
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
                  dataIndex: 'order_amount'
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
            <Col span={12}>
              <BizForm.Item
                name="remark"
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
                goodsInfo={detail?.goods_info ?? []}
                countryId={detail?.country?.id}
                limitEditGoodsNum={isNeedLimitOrder}
                ignoreColumns={['sell_price']}
                ignoreAction={['received_amount', 'discount_amount', 'premium_amount']}
                ignoreAmount={isNeedLimitOrder ? ['goods', 'premium', 'discount', 'advanced', 'collect'] : []}
              />
            </>
          )
        }
      </BizForm>
    </Card>
  )
}
