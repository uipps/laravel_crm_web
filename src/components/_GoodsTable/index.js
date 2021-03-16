import { createRef, useState, useEffect } from 'react'

import { useModel, useIntl, useRequest, useLocation } from 'umi';
import { Space, Form, Button, Checkbox, Upload, Input, InputNumber, Table } from 'antd'
import { UploadOutlined, CloseOutlined, LinkOutlined, CheckOutlined } from '@ant-design/icons'
import { DataSheet, FieldSelect, FieldNumber, Picture } from '..'
import services from '@/services'
import { _, pluto, numeral } from '@/utils'
import DescItem from './Item'
import File from './File'
import styles from './styles.less'
const { countPrice, filterGoods, tropeGoods, flatActivitiy, calculate } = pluto
const ignoreDescItem = ['goods', 'premium', 'discount', 'advanced', 'collect'];

const combineProps = { props: { colSpan: 0 } } // 合并单元格的常量

function doValue(rule_ids = [], maps = {}, old = {}) {
  maps = maps || {}
  old = old || {}
  let arr = Array.isArray(rule_ids)
    ? rule_ids.reduce((pre, rule_id) => {
      return rule_id in maps
        ? [...pre, rule_id + '']
        : [...pre, (old[rule_id] ? old[rule_id].rule_name : '')]
    }, [])
    : Object.values(rule_ids || {})
  return arr.map(d => String(d))
}

export default function _GoodsTable({
  greenShot = false,
  disabled = false,
  isPromotion = false,
  limitEditGoodsNum = false,
  addibleAction = [],
  ignoreAmount = [],
  onAdd,
  form,
  goodsInfo,
  assets
}) {
  const { formatMessage } = useIntl()
  const { pathname } = useLocation();

  const { currencyCode } = useModel('cascade');
  const [rowKeys, setRowKeys] = useState([])
  const [limit, setLimit] = useState({})
  const [activityMap, setActivityMap] = useState(null)
  const [isReceived, setReceived] = useState(false); // 预付款输入组件的显示状态
  const [isDiscount, setDiscount] = useState(false); // 优惠价格组件的显示状态
  const [isPremium, setPremium] = useState(false); // 溢价组件的显示状态
  let { data: activities } = useRequest(services.promotionAble, {
    manual: !isPromotion,
    formatResult: resp => {
      setActivityMap()
      return {
        list: resp?.data?.list ?? [],
        maps: flatActivitiy(resp?.data?.list ?? [])
      }
    }
  })
  useEffect(() => {
    if (goodsInfo && goodsInfo.length > 0) {
      let _goodsInfo = countPrice(goodsInfo)
      if (activities && activities.maps) {
        let activityMap = activities.maps || {}
        setActivityMap(activityMap)
        _goodsInfo = tropeGoods(_goodsInfo, activityMap)
        form.setFieldsValue({ goods_info: _goodsInfo })
      } else {
        form.setFieldsValue({ goods_info: _goodsInfo })
      }
    }
  }, [goodsInfo, activities])

  // 表格中number输入框改变时
  const onChangeNumber = (num, record) => {
    let _goodsInfo = form.getFieldValue('goods_info')
    let originGoodsInfo = form.getFieldValue('source_order')

    if (limitEditGoodsNum && Array.isArray(originGoodsInfo)) {
      let { num: orderGoodsNum = 0 } = originGoodsInfo?.find(o => o.id === record.order_id)?.goods_info?.find(g => g.id === record.id)
      num = num >= orderGoodsNum ? orderGoodsNum : num;
    }

    _goodsInfo = _goodsInfo.map(item => item.id === record.id ? { ...item, num } : item);
    _goodsInfo = countPrice(_goodsInfo)
    if (isPromotion) {
      _goodsInfo = _goodsInfo.filter(item => !item._expandable)
      _goodsInfo = tropeGoods(_goodsInfo, activityMap)
    }
    form.setFieldsValue({ goods_info: _goodsInfo })
  };
  // 活动的下拉框改变时
  const onPromotionChange = (key, record) => {
    if (activityMap) {
      let acItem = activityMap[key]
      let dataSource = form.getFieldValue('goods_info')
      dataSource = dataSource.filter(item => !item._expandable)
      let goods_info = dataSource.map(({ rule_ids = {}, ...item }) => {
        return item.id === record.id ? {
          ...item,
          rule_ids: acItem ? {
            ...(acItem.rule_attr === 1 ? rule_ids : {}),
            [acItem.promotion_id]: acItem.rule_id
          } : {}
        } : { ...item, rule_ids: rule_ids }
      })
      goods_info = tropeGoods(goods_info, activityMap)
      form.setFieldsValue({ goods_info })
    }
  }
  // 所有checkbox 改变时
  const onCheckedChange = (e, key) => {
    if (e.target.checked === false && form) {
      form.resetFields([`${key}_amount`])
    }
    if (key === 'received') {
      setReceived(e.target.checked);
    }
    if (key === 'discount') {
      setDiscount(e.target.checked);
    }
    if (key === 'premium') {
      setPremium(e.target.checked);
    }
  };
  // 将商品移除的操作
  const onRemove = () => {
    if (form) {
      let dataSource = form.getFieldValue('goods_info')
      let goods_info = dataSource.filter(item => !rowKeys.includes(item.id))
      setRowKeys([])
      form.setFieldsValue({ goods_info })
    }
  }
  function shouldUpdate(pre, curr) {
    return JSON.stringify(pre.goods_info) !== JSON.stringify(curr.goods_info) 
    || JSON.stringify(pre.received_amount) !== JSON.stringify(curr.received_amount) 
    || JSON.stringify(pre.discount_amount) !== JSON.stringify(curr.discount_amount) 
    || JSON.stringify(pre.premium_amount) !== JSON.stringify(curr.premium_amount) 
  }
  // 预付金额验证
  function validatorReceived(rule, received_amount) {
    if (received_amount > limit.orderAmount) {
      return Promise.reject(formatMessage({ id: 'app.message.warn-received' }))
    }
    return Promise.resolve()
  }
  // 优惠金额验证
  function validatorDiscount(rule, discount_amount) {
    if (discount_amount > limit.orderAmount) {
      return Promise.reject(formatMessage({ id: 'app.message.warn-discount' }))
    }
    return Promise.resolve()
  }
  const rowSelection = addibleAction.includes('delete') && {
    type: 'checkbox',
    selectedRowKeys: rowKeys,
    onChange: selectedRowKeys => setRowKeys(selectedRowKeys),
  }

  const columns = [
    {
      title: formatMessage({ id: 'app.common.goodsName', defaultMessage: '商品名称' }),
      dataIndex: 'internal_name',
      render: (v, r) => r._expandable ? {
        props: { colSpan: 7 },
        children: (
          <div className={styles.expandable}>
            <span>{r._expandable?.title}</span>
            {!r._expandable.warn && <span>{formatMessage({ id: 'app.message.discontentActivity' })}</span>}
          </div>
        )
      } : (
          <div className={styles.product}>
            <Picture src={r.pic_url} mode="aspectFit" width={58} height={58} />
            <span>{v}</span>
          </div>
        )
    },
    {
      title: formatMessage({ id: 'app.common.attribute', defaultMessage: '属性' }),
      align: 'center',
      dataIndex: ['option_values', 'title'],
      render: (v, r) => r._expandable ? combineProps : v
    },
    {
      title: formatMessage({ id: 'app.common.sku', defaultMessage: 'SKU' }),
      align: 'center',
      dataIndex: 'sku',
      width: 200,
      render: (v, r) => r._expandable ? combineProps : v
    },
    {
      title: formatMessage({ id: 'app.common.price', defaultMessage: '价格' }),
      dataIndex: 'unit_price',
      align: 'right',
      width: 180,
      render: (v, r) => r._expandable ? combineProps : numeral(v).format('0,0.00')
    },
    {
      title: formatMessage({ id: 'app.common.number', defaultMessage: '数量' }),
      width: 140,
      dataIndex: 'num',
      align: 'center',
      render: (v, r) => r._expandable ? combineProps : (
        disabled ? v : <FieldNumber
          max={r._max || 10000}
          min={0}
          value={v}
          onChange={v => onChangeNumber(v, r)}
        />
      )
    },
    {
      title: formatMessage({ id: 'app.common.amountGoods', defaultMessage: '商品金额' }),
      dataIndex: 'total_amount',
      align: 'right',
      width: 140,
      render: (v, r) => r._expandable ? combineProps : numeral(v).format('0,0.00')
    },
    ...(isPromotion ? [
      {
        title: formatMessage({ id: 'app.common.activity', defaultMessage: '活动' }),
        width: 200,
        render: (v, r) => {
          return r._expandable ? combineProps : (
            <FieldSelect
              disabled={disabled}
              option={activities?.list ?? []}
              mapValue="id"
              style={{ width: 180 }}
              mapChildValue="rule_id"
              mapChild="promotion_rules"
              mapChildName="rule_name"
              mapChildRest="promotion_id"
              placeholder={formatMessage({
                id: 'app.common.placeholder.discountPrograms',
                defaultMessage: '不使用活动优惠'
              })}
              menuItemSelectedIcon={<CheckOutlined />}
              allowClear
              getPopupContainer={() => document.body}
              mode="tag"
              value={Array.isArray(r.rules) ? r.rules.map(({ rule_id }) => String(rule_id)) : []}
              onChange={k => onPromotionChange(k, r)}
            />
          )
        }
      }
    ] : [])
  ]
  return (
    <>
      <Form.Item name="goods_info" valuePropName="dataSource" noStyle>
        <Table
          style={{ padding: 0, position: 'relative', zIndex: 10 }}
          rowSelection={rowSelection}
          pagination={false}
          rowKey="id"
          bordered
          columns={columns} // 过滤表格配置
        />
      </Form.Item>
      <div className={styles.container}>
        <section>
          <Space size="small" align="baseline">
            <div style={{display: "flex", lineHeight: "2.2"}}>
              {
                addibleAction.includes('delete') &&
                <Button
                  disabled={!rowKeys.length}
                  onClick={onRemove}
                  className={styles.mr}
                >
                  {formatMessage({ id: 'app.global.delete', defaultMessage: '删除' })}
                </Button>
              }
              {
                addibleAction.includes('add') &&
                <Button
                  onClick={onAdd}
                  type="primary"
                  ghost
                  className={styles.mr}
                >
                  {formatMessage({ id: 'app.global.add', defaultMessage: '添加' })}
                </Button>
              }
              {/** start 已收金额 */}
              {
                addibleAction.includes('received') &&
                <Form.Item
                  dependencies={['received_amount']}
                  shouldUpdate={(prev, cur) => cur.received_amount !== prev.received_amount}
                  noStyle
                  className={styles.mr}
                >
                  {
                    ({ getFieldValue }) => {
                      // 检验默认数据是否要选中
                      let _value = getFieldValue('received_amount')
                      if (_value && Number(_value) > 0 && isReceived === false) {
                        setReceived(true)
                      }
                      return (
                        <Checkbox
                          checked={isReceived}
                          onChange={e => onCheckedChange(e, 'received')}
                        >
                          {formatMessage({
                            id: 'app.common.acceptedAdvanced',
                            defaultMessage: '已收预付款'
                          })}
                        </Checkbox>
                      )
                    }
                  }
                </Form.Item>
              }
              {
                (isReceived || greenShot) &&
                <Form.Item
                  name={['attachment', 'file_url']}
                  wrapperCol={{ span: 24 }}
                  style={{ marginBottom: 0 }}
                  rules={[{
                    required: true,
                    message: formatMessage({ id: 'app.message.warn-file' })
                  }]}
                  className={styles.mr}
                >
                  <File disabled={greenShot} />
                </Form.Item>
              }
              {
                isReceived &&
                <Form.Item
                  name="received_amount"
                  style={{ marginBottom: 0 }}
                  wrapperCol={false}
                  rules={[{ validator: validatorReceived }]}
                  className={styles.mr}
                >
                  <InputNumber
                    style={{ width: 120, }}
                    min={0}
                  />
                </Form.Item>
              }
              {/** end 已收金额 */}
              {/** start 订单优惠*/}
              {
                addibleAction.includes('discount') &&
                <Form.Item
                  dependencies={['discount_amount']}
                  shouldUpdate={(prev, cur) => cur.discount_amount !== prev.discount_amount}
                  noStyle
                  className={styles.mr}
                >
                  {
                    ({ getFieldValue }) => {
                      // 检验默认数据 是否要选中 -订单优惠
                      let _value = getFieldValue('discount_amount')
                      if (_value && Number(_value) > 0 && isDiscount === false) {
                        setDiscount(true)
                      }
                      return (
                        <Checkbox
                          checked={isDiscount}
                          onChange={e => onCheckedChange(e, 'discount')}
                        >
                          {formatMessage({ id: 'app.common.orderDiscount', defaultMessage: '订单优惠' })}
                        </Checkbox>
                      )
                    }
                  }
                </Form.Item>
              }
              {
                isDiscount &&
                <Form.Item
                  name="discount_amount"
                  style={{ marginBottom: 0 }}
                  rules={[{ validator: validatorDiscount }]}
                  className={styles.mr}
                >
                  <InputNumber
                    style={{ width: 96 }}
                    min={0}
                  />
                </Form.Item>
              }
              {/** end 订单优惠*/}
              {
                addibleAction.includes('premium') &&
                <Form.Item
                  dependencies={['premium_amount']}
                  shouldUpdate={(prev, cur) => cur.premium_amount !== prev.premium_amount}
                  noStyle
                  className={styles.mr}
                >
                  {
                    ({ getFieldValue }) => {
                      let _value = getFieldValue('premium_amount')
                      if (_value && Number(_value) > 0 && isPremium === false) {
                        setPremium(true)
                      }
                      return (
                        <Checkbox
                          checked={isPremium}
                          onChange={e => onCheckedChange(e, 'premium')}
                        >
                          {formatMessage({ id: 'app.common.orderPremium', defaultMessage: '订单溢价' })}
                        </Checkbox>
                      )
                    }
                  }
                </Form.Item>
              }
              {
                isPremium &&
                <Form.Item name="premium_amount" noStyle style={{ marginBottom: 0 }} className={styles.mr}>
                  <InputNumber
                    style={{ width: 96 }}
                    min={0}
                    // max={limit.goodsAmount + limit.premiumAmount - limit.receivedAmount}
                  />
                </Form.Item>
              }
            </div>
          </Space>
        </section>
        <Space>
          <Form.Item
            dependencies={['goods_info', 'received_amount', 'discount_amount', 'premium_amount']}
            shouldUpdate={shouldUpdate}
            noStyle
          >
            {({ getFieldValue }) => {
              const goodsInfo = getFieldValue('goods_info')
              const receivedAmount = getFieldValue('received_amount')
              const discountAmount = getFieldValue('discount_amount')
              const premiumAmount = getFieldValue('premium_amount')
              console.log('discountAmount', discountAmount)
              const result = calculate(goodsInfo, {
                receivedAmount,
                discountAmount,
                premiumAmount,
              }, activityMap)

               if (JSON.stringify(result) !== JSON.stringify(limit)) {
                 setLimit(result)
              }
              const allAmountIgnored = ignoreDescItem.every(v => ignoreAmount.includes(v));

              return (
                goodsInfo && (
                  <div className={styles.desc}>
                    {
                      !ignoreAmount.includes('goods') &&
                      <DescItem
                        title={formatMessage({ id: 'app.common.goodsAmount', defaultMessage: '商品总金额' })}
                        prefix={currencyCode}
                        value={result.goodsAmount}
                      />
                    }
                    {
                      !ignoreAmount.includes('premium') &&
                      <DescItem
                        title={formatMessage({ id: 'app.common.premiumAmount', defaultMessage: '溢价金额' })}
                        prefix={currencyCode}
                        value={result.premiumAmount}
                      />
                    }
                    {
                      !ignoreAmount.includes('discount') &&
                      <DescItem
                        title={formatMessage({ id: 'app.common.discountAmount', defaultMessage: '优惠金额' })}
                        prefix={currencyCode}
                        symbol="-"
                        value={assets?.package_flag === 1 ? assets.discount_amount : result.discountAmount}
                      />
                    }
                    {
                      !ignoreAmount.includes('advanced') &&
                      <DescItem
                        title={formatMessage({ id: 'app.common.advancedAmount', defaultMessage: '预付金额' })}
                        prefix={currencyCode}
                        symbol="-"
                        value={result.receivedAmount}
                      />
                    }
                    {
                      !ignoreAmount.includes('collect') &&
                      <DescItem
                        title={formatMessage({ id: 'app.common.receivableAmount', defaultMessage: '应收金额' })}
                        prefix={currencyCode}
                        value={result.collectAmount}
                      />
                    }
                    <DescItem
                      title={formatMessage({ id: 'app.common.orderTotalAmount', defaultMessage: '订单总金额' })}
                      prefix={currencyCode}
                      value={allAmountIgnored && limitEditGoodsNum ? 0 : (assets?.package_flag === 1 ? assets.order_amount : result.orderAmount)}
                    />

                  </div>
                )
              );
            }}
          </Form.Item>
        </Space>
      </div>
    </>
  )
}
