import { BizForm, FieldSelect, FieldInput } from '@/components';
import { Card, Button, message, Row, Col, Input } from 'antd'
import { useIntl, useRequest, history, useParams } from 'umi'
import { useState, useEffect } from 'react'

import services from '@/services';
import { basic } from '@/utils'

export default function(props) {
  const { route } = props

  const formatMessage = useIntl().formatMessage

  const [form] = BizForm.useForm();

  const initialValues = {

  }

  // 所有表单的选项值
  const [options, setOptions] = useState({
    language_id: [],
    country_id: [],
    advisory_type: basic.formatDDIC('customer_clue.advisory_type', true),
    quality_level: basic.formatDDIC('customer_clue.quality_level', true),
  })

  const { id } = useParams()

  // 请求语言maps
  useRequest(services.queryLangs, {
    onSuccess({ list }) {
      setOptions({...options, language_id: list})
    }
  })

  // 请求国家maps
  useRequest(services.queryCountry, {
    onSuccess({ list }) {
      setOptions({...options, country_id: list})
    }
  })
   const onSuccess = () => {
     message.success({
       content: formatMessage({id: 'app.message.add.success'}),
       key: 'submitClue',
       duration: 2,
       onClose() {
         history.goBack()
       }
     });
   }
  // 添加活动
  const { run: runAddClue } = useRequest(services.clueAdd, { manual: true, onSuccess })

  // 详情查询
  const { run: runClueQuery } = useRequest(services.clueDetail, { manual: true })

  // 活动编辑
  const { run: runClueEdit } = useRequest(services.goodsEdit, { manual: true, onSuccess })

  useEffect(() => {
    if(id) {
      runClueQuery({id}).then((values) => {
        form.setFieldsValue(basic.toFormData(values))
      })
    }
  }, [id])

  const onFinish = () => {
    const field = form.getFieldsValue()

    return id ? runClueEdit(field) : runAddClue(field)
  }

  const validatorForm = () => {
    const { whatsapp_id, facebook_id, line_id } = form.getFieldsValue()

    if(whatsapp_id || facebook_id || line_id) {
      return Promise.resolve(true)
    }
    return Promise.reject(formatMessage({ id: 'app.common.needFWL' }))
  }

  const handlerValuesChange = (val) => {
    const watchKeys = ['whatsapp_id', 'facebook_id', 'line_id']
    const key = Object.keys(val)[0]
    if(watchKeys.includes(key)) {
      form.validateFields(watchKeys)
    }
  }

  return(
    <Card
      title={route.title}
      className="biz-card"
    >
      <BizForm
        form={form}
        initialValues={initialValues}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 10}}
        scrollToFirstError
        onFinish={onFinish}
        onValuesChange={handlerValuesChange}
        validateMessages={{
          required: formatMessage({id: 'app.global.pleaseInput'})
        }}
      >
        <Row>
          <Col span={12}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.customerName'})}
              name="name"
              rules={[
                {
                  required: true,
                }
              ]}
            >
              <FieldInput/>
            </BizForm.Item>
          </Col>

          <Col span={12}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.language'})}
              name="language_id"
              rules={[
                {
                  required: true,
                }
              ]}
            >
              <FieldSelect
                option={options.language_id}
                mapValue="id"
                placeholder={formatMessage({id: 'app.global.all'})}
              />
            </BizForm.Item>
          </Col>

          <Col span={12}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.faceBookId'})}
              name="facebook_id"
              rules={[
                {
                  validator: validatorForm,
                  validateTrigger: 'onChange'
                }
              ]}
            >
              <FieldInput/>
            </BizForm.Item>
          </Col>

          <Col span={12}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.countryRegions'})}
              name="country_id"
              rules={[
                {
                  required: true,
                }
              ]}
            >
              <FieldSelect
                option={options.country_id}
                mapName="display_name"
                mapValue="id"
                placeholder={formatMessage({id: 'app.global.all'})}
              />
            </BizForm.Item>
          </Col>

          <Col span={12}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.whatAppId'})}
              name="whatsapp_id"
              rules={[
                {
                  validator: validatorForm,
                  validateTrigger: 'onChange'
                }
              ]}
            >
              <FieldInput/>
            </BizForm.Item>
          </Col>

          <Col span={12}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.seekType'})}
              name="advisory_type"
              rules={[
                {
                  required: true,
                }
              ]}
            >
              <FieldSelect
                option={options.advisory_type}
                mapName="label"
                placeholder={formatMessage({id: 'app.global.all'})}
              />
            </BizForm.Item>
          </Col>

          <Col span={12}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.lineId'})}
              name="line_id"
              rules={[
                {
                  validator: validatorForm,
                  validateTrigger: 'onChange'
                }
              ]}
            >
              <FieldInput/>
            </BizForm.Item>
          </Col>

          <Col span={12}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.sourceClue'})}
              name="clue_source"
              rules={[
                {
                  required: true,
                },
                {
                  type: 'url',
                  message: formatMessage({id: 'app.message.needUrl'})
                }
              ]}
            >
              <FieldInput placeholder={formatMessage({id: 'app.common.placeholder.sourceClueDesc'})} />
            </BizForm.Item>
          </Col>

          <Col span={12}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.qualityClue'})}
              name="quality_level"
              rules={[
                {
                  required: true,
                }
              ]}
            >
              <FieldSelect
                option={options.quality_level}
                mapName="label"
                placeholder={formatMessage({id: 'app.global.all'})}
              />
            </BizForm.Item>
          </Col>

          <Col span={12}/>

          <Col span={12}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.customerRemark'})}
              name="remark"
            >
              <Input.TextArea />
            </BizForm.Item>
          </Col>

          <Col span={12}/>

          <Col span={12}>
            <BizForm.Item
              label=" "
              colon={false}
            >
              <Button
                type="primary"
                htmlType="submit"
              >
                {formatMessage({id: `app.global.${id ? 'save' : 'add'}`})}
              </Button>
            </BizForm.Item>
          </Col>
        </Row>
      </BizForm>
    </Card>
  )
}
