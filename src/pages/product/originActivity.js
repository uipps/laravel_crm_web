import { BizForm, IconFont, _SelectGoods, FieldSelect } from '@/components';
import { Card, Button, Input, Radio, InputNumber, Table, message, Modal } from 'antd'
import { useIntl, useRequest, useModel, history, useParams } from 'umi'
import { useState, useEffect } from 'react'
import './styles/style.less'

import services from '@/services';
import { basic, numeral } from '@/utils'

const ListInput = function(props) {
  const { onChange, value:listData=[], disabled=false } = props

  const formatMessage = useIntl().formatMessage

  const onAddRule = () => {
    onChange && onChange([...listData, {}])
  }

  const onDelRule = (index) => {
    Modal.confirm({
      title: formatMessage({id: 'app.common.deleteRule'}),
      onOk() {
        onChange && onChange([...listData.slice(0, index), ...listData.slice(index+1)])
      }
    })
  }

  const onRuleChange = (val, index, type) => {
    onChange && onChange(listData.map((item, i) => index === i ? {...item, [type]: val} : item ) )
  }

  const formatFloat = function (f, digit) {
    const m = Math.pow(10, digit);
    return Math.round(f * m, 10) / m;
  }

  return(
    <div className="listInput">
      {!disabled &&
        <Button ghost type='primary' onClick={onAddRule}>
          {formatMessage({id: 'app.common.addRule'})}
        </Button>
      }

      {listData.map((item, index) => (
        <div className="listInput__item" key={index}>
          <span>
            {formatMessage({id: 'app.common.activityDiscountDesc'},
              {
                count: <InputNumber
                  disabled={disabled}
                  value={item.min_num}
                  min={0}
                  onChange={(val) => {onRuleChange(val, index, 'min_num')}}
                />,
                number: <InputNumber
                  disabled={disabled}
                  value={item.discount}
                  min={0}
                  max={1}
                  step={0.01}
                  formatter={v => v && formatFloat(Number(v) * 10, 2)}
                  parser={v => v && formatFloat(Number(v) / 10, 2)}
                  onChange={(val) => {onRuleChange(val, index, 'discount')}}
                />,
              }
            )}
          </span>
          {!disabled &&
            <Button type="link" onClick={() => { onDelRule(index) }}>
              {formatMessage({id: 'app.global.delete'})}
            </Button>
          }
        </div>
      ))}
    </div>
  )
}

const TableField = function(props) {
  const { onChange, value:checkedValue=[], disabled=false, form } = props

  const formatMessage = useIntl().formatMessage

  let columns = [
    {
      title: formatMessage({id: 'app.common.goodsName'}),
      dataIndex: 'product_name',
      render(text, record) {
        return(
          <>
            <img style={{width: 40, height: 40, marginRight: 16}} src={record.pic_url} alt="img"/>
            <span>{text}</span>
          </>
        )
      }
    },
    {
      title: formatMessage({id: 'app.common.attribute'}),
      dataIndex: ['option_values', 'title'],
    },
    {
      title: formatMessage({id: 'app.common.sku'}),
      dataIndex: 'sku',
    },
    // {
    //   title: formatMessage({id: 'app.common.price'}),
    //   dataIndex: 'unit_price',
    //   align: 'right',
    //   render: v => numeral(v).format('0,0.00'),
    // },
    {
      title: formatMessage({id: 'app.global.action'}),
      dataIndex: 'k5',
      align: 'center',
      render(text, record) {
        return(
          <a onClick={() => { onDelLine(record) }}>{formatMessage({id: 'app.global.delete'})}</a>
        )
      }
    },
  ]
  columns = !disabled ? columns : columns.slice(0, columns.length-1)

  let { _selectGoods } = useModel('modal'); // 弹窗可见性状态

  const onAddGoods = () => {
    _selectGoods.setVisible(true)
  }

  const handlerAddGoods = (result) => {
    onChange && onChange([...result])
  }

  const onDelLine = (record) => {
    Modal.confirm({
      title: formatMessage({id: 'app.common.deleteGoods'}),
      onOk() {
        onChange && onChange(checkedValue.filter(item => item.id !== record.id ))
      }
    })
  }

  return(
    <div>
      <Table
        dataSource={checkedValue}
        columns={columns}
        locale={{
          emptyText: <div style={{color: '#9e9e9e', padding: 16}}>{formatMessage({id: 'app.common.placeholder.addGoods'})}</div>
        }}
        pagination={false}
        rowKey="id"
      />
      {!disabled &&
        <div style={{paddingTop: 8}}>
          <Button icon={<IconFont type="icon-plus" />} ghost type="primary" onClick={onAddGoods}>
            {formatMessage({id: 'app.common.addGoods'})}
          </Button>
        </div>
      }

      <_SelectGoods value="promotion_goods" onOk={handlerAddGoods} rowKey="id" form={form} />
    </div>
  )
}

export default function(props) {
  const { route } = props

  const formatMessage = useIntl().formatMessage

  const [form] = BizForm.useForm();

  const initialValues = {
    status: '1',
    rule_attr: '2',
    rule_scope: '1',
    goods_scope: '1',
    promotion_rules: [],
    promotion_goods: [],
  }

  // 所有表单的选项值
  const options = {
    type: basic.formatDDIC('promotion.type', true),
    status: basic.formatDDIC('promotion.status', true).reverse(),
    rule_attr: basic.formatDDIC('promotion.rule_attr', true).map(v => ({ ...v, disabled: v.value === '1'})),
    rule_scope: basic.formatDDIC('promotion.rule_scope', true),
    goods_scope: basic.formatDDIC('promotion.goods_scope', true),
  }

  let { id } = useParams()

  // 添加活动
  const { run: runAddActivity } = useRequest(services.activityAdd, {
    manual: true,
    onSuccess() {
      message.success({
        content: formatMessage({id: 'app.message.add.success'}),
        key: 'submitActivity',
        duration: 2,
        onClose() {
          history.goBack()
        }
      })
    }
  })

  // 活动详情
  const { run: runActivityQuery } = useRequest(services.activityQuery, {
    manual: true,
    onSuccess(values) {
      values = basic.toFormData(values, { transform: ['status'] })
      form.setFieldsValue(values)

      // 更新商品列表模态框
      handlerValuesChange({ goods_scope: values.goods_scope  })
    },
  })

  // 活动编辑
  const { run: runActivityEdit } = useRequest(services.activityEdit, {
    manual: true,
    onSuccess() {
      message.success({
        content: formatMessage({id: 'app.message.edit.success'}),
        key: 'submitActivity',
        duration: 2,
        onClose() {
          history.goBack()
        }
      });
    }
  })

  useEffect(() => {
    if(id) {
      runActivityQuery({id}).then()
    }
  }, [id])

  // 是否显示商品列表
  const [showGoodsList, setShowGoodsList] = useState(initialValues.goods_scope !== '1')

  const onCancel = () => {
    history.goBack()
  }

  const onFinish = () => {
    form.validateFields().then((field) => {
      message.loading({ content: formatMessage({id: 'app.message.submitting'}), key: 'submitActivity' });
      const fetch = id ? runActivityEdit : runAddActivity
      fetch(field).then()
    })
  }

  const handlerValuesChange = (changedValues) => {
    if('goods_scope' in changedValues) {
     setShowGoodsList(changedValues.goods_scope !== '1')
    }
  }

  return (
    <Card title={route.title} className="activity">
      <BizForm
        className="activity__form"
        form={form}
        initialValues={initialValues}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        scrollToFirstError
        onValuesChange={handlerValuesChange}
        footerLayout={{ span: 24 }}
        footerRight
        footer={
          <>
            <Button onClick={onCancel}>
              {formatMessage({ id: 'app.global.cancel' })}
            </Button>
            <Button onClick={onFinish} type="primary">
              {formatMessage({ id: `app.global.${id ? 'save' : 'add'}`})}
            </Button>
          </>
        }
      >
        <BizForm.Item
          label={formatMessage({ id: 'app.common.activityName' })}
          name="name"
          className="line-input"
          rules={[
            {
              required: true,
              message: formatMessage({id: 'app.common.activityMustState'}),
            }
          ]}
        >
          <Input
            placeholder={formatMessage({id: 'app.common.placeholder.activityName'})}
          />
        </BizForm.Item>

        <BizForm.Item
          label={formatMessage({ id: 'app.common.activityType' })}
          name="type"
          className="line-input"
          rules={[
            {
              required: true,
              message: formatMessage({id: 'app.common.activityMustType'}),
            }
          ]}
        >
          <FieldSelect
            placeholder={formatMessage({id: 'app.common.placeholder.activitySelectType'})}
            option={options.type}
            mapName="label"
          />
        </BizForm.Item>

        <BizForm.Item
          label={formatMessage({ id: 'app.common.activityState' })}
          name="status"
        >
          <Radio.Group
            options={options.status}
          />
        </BizForm.Item>

        { /*活动规则*/ }
        <BizForm.Partition title={formatMessage({id: 'app.common.activityRule'})} />
        <BizForm.Item
          label={formatMessage({ id: 'app.common.ruleContent' })}
          name="promotion_rules"
          rules={[
            {
              required: true,
              message: formatMessage({id: 'app.common.placeholder.activityMustRule'}),
            },
            {
              validator(_, value) {
                return (
                  value && value.some(e => (!e.min_num || !e.discount))
                    ? Promise.reject(formatMessage({id: 'app.common.missingRule'}))
                    : Promise.resolve()
                )
              },
              validateTrigger: 'onSubmit'
            }
          ]}
        >
          <ListInput />
        </BizForm.Item>

        <BizForm.Item
          label={formatMessage({ id: 'app.common.activitySuperposition' })}
        >
          <BizForm.Item name="rule_attr" noStyle>
            <Radio.Group
              options={options.rule_attr}
            />
          </BizForm.Item>
          <div className="activity__tip">{formatMessage({id: 'app.common.activityStackTip'})}</div>
        </BizForm.Item>

        { /*活动商品*/ }
        <BizForm.Partition title={formatMessage({id: 'app.common.activityGoods'})} />

        <BizForm.Item
          label={formatMessage({ id: 'app.common.ruleScope' })}
        >
          <BizForm.Item name="rule_scope" noStyle>
            <Radio.Group
              options={options.rule_scope}
            />
          </BizForm.Item>
          <div className="activity__tip">{formatMessage({id: 'app.common.activityScopeTip'})}</div>
        </BizForm.Item>

        <BizForm.Item
          label={formatMessage({ id: 'app.common.goodsScope' })}
          name="goods_scope"
        >
          <Radio.Group
            options={options.goods_scope}
          />
        </BizForm.Item>

        {/*  表格  */}
        {showGoodsList &&
          <BizForm.Item
            labelCol={{
              span: 0
            }}
            wrapperCol={{
              span: 24
            }}
            name="promotion_goods"
            rules={[
              {
                required: true,
                message: formatMessage({id: 'app.common.activityMustGoods'}),
              },
            ]}
          >
            <TableField form={form} />
          </BizForm.Item>
        }

      </BizForm>
    </Card>
  )
}
