import { useEffect } from 'react'

import { useModel, useRequest, useIntl } from 'umi'
import services from '@/services'

import { Form, Modal, Input, Row, Col } from 'antd'
import { FieldSelect } from '..'
import { IconFont } from '@/components'

import './style.less'

export default function ({
  onSubmit
}) {
  const intl = useIntl()
  const { customerService } = useModel('order')
  const [form] = Form.useForm()
  const { data: lang, run: runLang } = useRequest(services.queryLangs, { manual: true })
  const { data: staff, run: runStaff, mutate } = useRequest(services.myStaff, { manual: true })
  useEffect(() => {
    if (customerService.visible) {
      runLang()
      runStaff()
    }
  }, [customerService.visible])
  const onChangeLang = (language_id) => {
    mutate(data => ({
      ...data,
      list: data.list.map(d => ({ ...d, disabled: d.language_ids !== language_id }))
    }))
  }
  const onOk = () => {
    const { label: name, value: id } = form.getFieldValue('staff')
    onSubmit && onSubmit({ id, name })
    customerService.setVisible(false)
  }
  const afterClose = () => {
    form.resetFields()
  }
  return (
    <Modal
      title={intl.formatMessage({id: 'app.common.transferTo'})}
      visible={customerService.visible}
      onCancel={() => customerService.setVisible(false)}
      okText={intl.formatMessage({ id: 'app.global.ok' })}
      cancelText={intl.formatMessage({ id: 'app.global.cancel' })}
      onOk={onOk}
      afterClose={afterClose}
    >
      <Form name="customer-service" form={form} component={false}>
        <Input.Group>
          <Row gutter={8}>
            <Col
              span={24}
              className="service-modal__title"
            >
              {intl.formatMessage({id: 'app.common.needCustomer'})}
            </Col>
            <Col span={6}>
              <FieldSelect
                placeholder={intl.formatMessage({id: 'app.common.allLanguage'})}
                option={lang ?.list ?? []}
                mapValue="id"
                style={{ width: '100%' }}
                onChange={onChangeLang}
                allowClear
              />
            </Col>
            <Col span={10}>
              <Form.Item name="staff" noStyle>
                <FieldSelect
                  option={staff ?.list ?? []}
                  mapValue="id"
                  mapName="real_name"
                  placeholder={intl.formatMessage({id: 'app.common.selectLanguage'})}
                  style={{ width: '100%' }}
                  labelInValue
                />
              </Form.Item>
            </Col>
          </Row>
        </Input.Group>
      </Form>

      <div className="service-modal__tip" style={{ fontSize: 12 }}>
        <IconFont type="icon-alert-o" />
        {intl.formatMessage({id: 'app.common.selectCustomerTip'})}
      </div>
    </Modal>
  )
}
