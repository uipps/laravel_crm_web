import { BizForm, Picture, FieldSelect } from '@/components';
import { Card, Button, Input, Radio, Table, message, Modal } from 'antd'
import { useIntl, useRequest, history, useParams, useModel } from 'umi'
import { useState, useEffect } from 'react'
import './styles/style.less'
import { ExclamationCircleOutlined } from '@ant-design/icons';

import services from '@/services';
import { basic } from '@/utils'

// 价格
function Price (props) {
  const { value, onChange } = props

  const formatMessage = useIntl().formatMessage

  // 获取国家
  let { country } = useModel('common')

  value.forEach(val => {
    country = country.map(item => String(item.id) === String(val.country_id) ? {...item, disabled: true} : item)
  })

  const onValueChange = (val, index, filed) => {
    if(filed === 'price') {
      const reg = /^\d*(\.\d*)?$/;
      if ((isNaN(val) || !reg.test(val))) {
        return false
      }
    }
    onChange && onChange(value.map((item, i) => index === i ? {...item, [filed]: val} : item ) )
  }

  const onDelValue = (index) => {
    Modal.confirm({
      title: formatMessage({id: 'app.common.confirmDelCountryPrice'}),
      onOk() {
        onChange && onChange([...value.slice(0, index), ...value.slice(index+1)])
      }
    })
  }

  const onAddValue = () => {
    onChange && onChange([...value, {}])
  }

  const getSuffix = ({ country_id }) => {
    const { currency } = country.find(v => String(v.id) === String(country_id)) || {}
    return currency?.symbol ?? ' '
  }

  return <div className="goods-price">
    {Array.isArray(value) && value.map((item, index) => (
      <div key={`${item.country_id}${index}`} className="goods-price__item space-style">
        <FieldSelect
          placeholder={formatMessage({id: 'app.message.country'})}
          style={{width: 180}}
          option={country}
          mapName="display_name"
          mapValue="id"
          value={item.country_id}
          onChange={(val) => onValueChange(val, index, 'country_id')}
        />
        <Input
          className="goods-price__input"
          placeholder={formatMessage({id: 'app.common.placeholder.price'})}
          addonAfter={getSuffix(item)}
          value={item.price}
          onChange={({currentTarget}) => onValueChange(currentTarget.value, index, 'price')}
        />
        {value.length > 1 &&
        <Button type="link" onClick={() => onDelValue(index)}>{formatMessage({id: 'app.global.delete'})}</Button>
        }
      </div>
    ))}

    <Button onClick={onAddValue}>{formatMessage({id: 'app.common.selectCountryPrice'})}</Button>
  </div>
}

// 图片
function Images(props) {
  const { value } = props
  return(
    <div style={{width: 100, height: 100, border: '1px solid #e0e0e0'}}>
      {value &&
        <Picture width="100%" height="100%" mode="aspectFit" src={value} />
      }
    </div>
  )
}
// 属性
function GoodsAttr(props) {
  const { value, onChange } = props

  const formatMessage = useIntl().formatMessage

  const columns = [
    {
      title: formatMessage({id: 'app.common.sku'}),
      dataIndex: 'sku',
      render: (t, record) => <span style={{...record.status === '0' ? { color: 'red' } : {}}}>{`${record.model}${t}`}</span>
    },
    {
      title: formatMessage({id: 'app.global.specs'}),
      dataIndex: 'title',
      render: (t, record) => <span style={{...record.status === '0' ? { color: 'red' } : {}}}>{t}</span>
    },
    {
      title: formatMessage({id: 'app.global.action'}),
      dataIndex: 'd',
      align: 'right',
      render(text, record) {
        return (
          <>
            {record.status === '0' &&
              <a onClick={() => { onRepealDelete(record) }}>{formatMessage({id: 'app.common.recovery'})}</a>
            }
            {record.status === '1' &&
              <a onClick={() => { onDelItem(record) }}>{formatMessage({id: 'app.global.delete'})}</a>
            }
          </>
        )
      }
    },
  ]

  const onDelItem = ({sku}) => {
    Modal.confirm({
      content: formatMessage({id: 'app.common.goodsDeleteSku'}),
      onOk() {
        onChange && onChange(value.filter(l => l.sku !== sku))
      },
      icon: <ExclamationCircleOutlined />,
      okText: formatMessage({id: 'app.global.ok'}),
      cancelText: formatMessage({id: 'app.global.cancel'}),
    })
  }

  const onRepealDelete = (record) => {
    const newRecord = { ...record, status: '1' }
    const index = value.indexOf(record)
    onChange && onChange([...value.slice(0, index), newRecord, ...value.slice(index+1)])
  }

  if (!value || !value.length) return '-'
  return(
    <>
      <Table
        columns={columns}
        dataSource={value}
        pagination={false}
        rowKey="sku"
      />
    </>
  )
}

export default function(props) {
  const { route } = props

  const formatMessage = useIntl().formatMessage

  const [form] = BizForm.useForm();

  const initialValues = {
    status: '1',
    price_list: [{}]
  }

  // 所有表单的选项值
  const options = {
    status: basic.formatDDIC('promotion.status', true),
  }

  const { id } = useParams()

  // 获取详情的成功之后
  let [sku_list_source, set_sku_list_source] = useState([])
  const onFetchSuccess = (data) => {
    set_sku_list_source(data.sku_list)
    data.sku_list = data.sku_list.filter(item => item.status === '1')

    form.setFieldsValue(basic.toFormData(data, {transform: ['status']}))
    setIsFull(true)
  }
  // 拉取erp商品成功之后
  const onPullSuccess = (data) => {
    if(!id) {  // 添加商品时
      data.sku_list = data.sku_list.filter(item => item.status === '1')

      form.setFieldsValue(basic.toFormData(data, {transform: ['status']}))
    } else {  // 编辑商品时
      const fields = form.getFieldsValue()
      const sku_list_del = sku_list_source.filter(item => item.status === '0')
      const sku_list = data.sku_list

      sku_list_del.forEach(d => {
        sku_list.find(l => l.sku === d.sku).status = '0'
      })
      const result = {...fields, sku_list}

      form.setFieldsValue(basic.toFormData(result, {transform: ['status']}))
    }
    setIsFull(true)
  }
  // 修改详情的成功回调
  const onEditSuccess = () => {
    message.success({
      content: formatMessage({id: `app.message.${id?'edit':'add'}.success`}),
      duration: 2,
      onClose() {
        history.goBack()
      }
    });
  }

  // 添加活动
  const { run: runAddGoods } = useRequest(services.goodsAdd, { manual: true, onSuccess: onEditSuccess })

  // 活动详情
  const { run: runGoodsQuery } = useRequest(services.goodsDetail, { manual: true, onSuccess: onFetchSuccess })

  // 活动编辑
  const { run: runGoodsEdit } = useRequest(services.goodsEdit, { manual: true , onSuccess: onEditSuccess })

  // 拉取ERP产品
  const { run: runPullProduct, loading: pullLoading } = useRequest(services.goodsPullProduct, {
    manual: true,
    onSuccess(data){ onPullSuccess(data,'pull')}
  })

  useEffect(() => {
    if(id) {
      runGoodsQuery({id}).then()
    }
  }, [id])

  const onFinish = () => {
    const fetch = id ? runGoodsEdit : runAddGoods
    const field = form.getFieldsValue()

    field.sku_list = field.sku_list.filter(item => item.status === '1')

    fetch(field).then()
  }

  // 页面是否已经填充状态
  const [isFull, setIsFull] = useState(false)

  const onPullProduct = () => {
    const id = form.getFieldValue('erp_product_id')
    if(id) {
      runPullProduct({id}).then()
    } else {
      form.validateFields()
    }
  }

  return(
    <Card title={route.title} className="goods">
      <BizForm
        className="goods__form"
        form={form}
        initialValues={initialValues}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        scrollToFirstError
        onFinish={onFinish}
      >
        <BizForm.Item
          label={formatMessage({ id: 'app.common.erpId' })}
        >
          <div className="space-style">
            <BizForm.Item
              name="erp_product_id"
              validateFirst
              rules={[
                {
                  required: true,
                  message: formatMessage({id: 'app.common.inputErpId'}),
                },
                {
                  transform(val) {
                    return Number(val)
                  },
                  type: 'number',
                  message: formatMessage({id: 'app.common.inputNumber'})
                }
              ]}
              noStyle>
              <Input
                placeholder={formatMessage({id: 'app.common.placeholder.erpId'})}
                disabled={!!id}
              />
            </BizForm.Item>
            <Button type="primary" onClick={onPullProduct} loading={pullLoading}>{formatMessage({id: 'app.common.pullData'})}</Button>
            <span>{formatMessage({id: 'app.common.pullDataTips'})}</span>
          </div>
        </BizForm.Item>

        <BizForm.Item
          label={formatMessage({ id: 'app.common.goodsName' })}
          name="product_name"
        >
          <Input
            placeholder={formatMessage({id: 'app.common.placeholder.goodsName'})}
          />
        </BizForm.Item>

        <BizForm.Item
          label={formatMessage({ id: 'app.common.sideName' })}
          name="internal_name"
        >
          <Input disabled />
        </BizForm.Item>

        <BizForm.Item
          label={formatMessage({ id: 'app.common.retailPrice' })}
          name="sell_price"
        >
          <Input disabled/>
        </BizForm.Item>

        <BizForm.Item
          label={formatMessage({ id: 'app.common.goodsPrice' })}
          name="price_list"
          validateFirst
          rules={
            [
              ...isFull
              ? [
                {
                  required: true,
                  message: formatMessage({id: 'app.common.needCountryPrice'}),
                },
                {
                  validator(_, value) {
                    return (
                      value && value.some(e => (!e.country_id || !e.price))
                        ? Promise.reject(formatMessage({id: 'app.common.missingPrice'}))
                        : Promise.resolve()
                    )
                  },
                  validateTrigger: 'onSubmit'
                },
              ]
              : []
            ]
          }
        >
          <Price />
        </BizForm.Item>

        <BizForm.Item
          label={formatMessage({ id: 'app.common.goodsImage' })}
          name="pic_url"
        >
          <Images/>
        </BizForm.Item>

        <BizForm.Item
          label={formatMessage({ id: 'app.common.goodsSpu' })}
          name="spu"
        >
          <Input disabled />
        </BizForm.Item>

        <BizForm.Item
          label={formatMessage({ id: 'app.common.goodsStatus' })}
          name="status"
        >
          <Radio.Group
            options={options.status}
          />
        </BizForm.Item>

        <BizForm.Item
          label={formatMessage({ id: 'app.common.goodsAttribute' })}
          name="sku_list"
          wrapperCol={{
            span: 10
          }}
        >
          <GoodsAttr />
        </BizForm.Item>

        <BizForm.Item
          label=" "
          colon={false}
        >
          <Button
            type="primary"
            htmlType="submit"
            disabled={!isFull}
          >
            {formatMessage({id: `app.global.${id ? 'save' : 'add'}`})}
          </Button>
        </BizForm.Item>

      </BizForm>
    </Card>
  )
}
