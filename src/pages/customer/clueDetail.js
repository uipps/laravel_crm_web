import { BizForm, FieldSelect, FieldInput, FieldText, TimeAxis } from '@/components';
import { Card, Button, message, Row, Col, Input, Space } from 'antd'
import { useIntl, useRequest, history, useParams, useModel } from 'umi'
import { useState, useEffect } from 'react'

import services from '@/services';
import { basic, _ } from '@/utils'

export default function(props) {
  const { route } = props

  const formatMessage = useIntl().formatMessage

  const [form] = BizForm.useForm();

  const initialValues = {}

  // 取model
  const { account } = useModel('@@initialState').initialState

  // 所有表单的选项值
  const [options, setOptions] = useState({
    advisory_type: basic.formatDDIC('customer_clue.advisory_type', true),
    quality_level: basic.formatDDIC('customer_clue.quality_level', true),
  })

  const { id } = useParams()

  // 详情查询
  const { run: runClueQuery } = useRequest(services.clueDetail, {
    defaultParams: [{id}],
    onSuccess(values) {
      // values.distribute_status = basic.formatDDIC(`customer_clue.distribute_status.${values.distribute_status}`)
      form.setFieldsValue(basic.toFormData(values))
    }
  })

  // 详情编辑
  const { run: runClueEdit } = useRequest(services.clueEdit, {
    manual: true,
    onSuccess() {
      message.success({
        content: formatMessage({id: 'app.message.save.success'}),
        key: 'clueSubmit',
        duration: 2,
        onClose() {
          history.goBack()
        }
      });
    }
  })

  // 添加线索追踪记录
  const { run: runAddRemark, loading: loadingAdd } = useRequest(services.clueAddTrack, {
    manual: true,
    onSuccess() {
      runQueryRemark().then(() => {
        message.success(formatMessage({id: 'app.message.add.success'}))

        setRemark('')
      })
    }
  })

  // 查询线索追踪记录
  const { data: remarkData, run: runQueryRemark } = useRequest(() => {
    return services.clueTrackList({id})
  })

  // 添加的remark状态
  const [ remark, setRemark] = useState('')

  const onFinish = () => {
    message.loading({ content: formatMessage({id: 'app.message.submitting'}), key: 'clueSubmit' });

    let field = form.getFieldsValue()
    runClueEdit({...field, id}).then()
  }

  const onAddRemark = () => {
    if(remark === '') {
      message.warn(formatMessage({ id: 'app.message.inputClue' }));
      return false
    }
    runAddRemark({remark, clue_id: id}).then()
  }

  return(
    <Card
      title={route.title}
      className="biz-card"
      extra={
        <Button
          disabled={account.is_clue_sale}
          onClick={() => { history.push(`/after-sales/order/create/clue/${id}`) }}
        >
          {formatMessage({id: 'app.common.addClueOrder'})}
        </Button>
      }
     >
      <BizForm
        form={form}
        initialValues={initialValues}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 10}}
        scrollToFirstError
        footerLayout={{ span: 24 }}
        footerRight
        footer={
          <>
            <Button onClick={onFinish} type="primary">
              {formatMessage({ id: `app.global.save`})}
            </Button>
          </>
        }
      >
        <BizForm.Partition title={formatMessage({id: 'app.common.clueInfo'})} />
        <Row>
          <Col span={6}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.clueCustomer'})}
              name="creator_name"
            >
              <FieldText />
            </BizForm.Item>
          </Col>

          <Col span={6}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.addDate'})}
              name="created_time"
            >
              <FieldText />
            </BizForm.Item>
          </Col>

          <Col span={6}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.distributionStatus'})}
              name="distribute_status"
            >
              <FieldText render={ v => basic.formatDDIC(`customer_clue.distribute_status.${v}`) } />
            </BizForm.Item>
          </Col>

          <Col span={6}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.assignCustomer'})}
              name="post_sale_name"
            >
              <FieldText />
            </BizForm.Item>
          </Col>

          <Col span={6}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.closingStatus'})}
              name="finish_status"
            >
              <FieldText />
            </BizForm.Item>
          </Col>
        </Row>

        <BizForm.Partition title={formatMessage({id: 'app.common.customerInfos'})} />
        <Row>
          <Col span={12}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.customerName'})}
              name="name"
            >
              <FieldInput />
            </BizForm.Item>
          </Col>

          <Col span={12}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.faceBookId'})}
              name="facebook_id"
            >
              <FieldInput />
            </BizForm.Item>
          </Col>

          <Col span={12}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.whatAppId'})}
              name="whatsapp_id"
            >
              <FieldInput />
            </BizForm.Item>
          </Col>

          <Col span={12}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.lineId'})}
              name="line_id"
            >
              <FieldInput />
            </BizForm.Item>
          </Col>

          <Col span={12}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.seekType'})}
              name="advisory_type"
            >
              <FieldSelect option={options.advisory_type} mapName="label" />
            </BizForm.Item>
          </Col>

          <Col span={12}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.sourceClue'})}
              name="clue_source"
            >
              <FieldInput />
            </BizForm.Item>
          </Col>

          <Col span={12}>
            <BizForm.Item
              label={formatMessage({id: 'app.common.qualityClue'})}
              name="quality_level"
            >
              <FieldSelect option={options.quality_level} mapName="label" />
            </BizForm.Item>
          </Col>
        </Row>

        <BizForm.Partition title={formatMessage({id: 'app.common.clueTracking'})} />
        <Row>
          <Col span={6}>
            <Space direction="vertical" style={{width: '100%'}}>
              <Input.TextArea
                rows={3}
                value={remark}
                placeholder={formatMessage({id: 'app.common.placeholder.clue'})}
                onChange={({ currentTarget }) => { setRemark(currentTarget.value) }}
              />
              <Button
                onClick={_.throttle(onAddRemark, 2000, { pending: true, trailing: false })}
                loading={loadingAdd}
              >
                {formatMessage({id: 'app.common.addRecord'})}
              </Button>
            </Space>
          </Col>
        </Row>

        <TimeAxis
          dataSource={remarkData?.list ?? []}
        />

      </BizForm>
    </Card>
  )
}
