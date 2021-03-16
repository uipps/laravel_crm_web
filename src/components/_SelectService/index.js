import { useState, useEffect } from 'react'

import { useModel, useRequest, useIntl } from 'umi'
import services from '@/services'

import { Form, Modal, Input, Row, Col, Alert } from 'antd'
import { FieldSelect } from '..'
import { IconFont } from '@/components'

import './style.less'

export default function ({
  onSubmit,
  title,
  desc,
  serviceNeedLangIds = [],  // string类型的语言ID 数组
  params = {},
  disabledLanguage,
  module,
}) {

  const intl = useIntl()
  const { _selectService } = useModel('modal')
  const [form] = Form.useForm()
  const [staff, setStaff] = useState([])
  const [allStaff, setAllStaff] = useState([])
  const { data: lang, run: runLang } = useRequest(services.queryLangs, { manual: true })
  const { run: runStaff } = useRequest(module === 'after-sales' ? services.afterStaff : services.myStaff, {
    manual: true,
    onSuccess: (res) => {
      let hasOnlyLangId = serviceNeedLangIds.length === 1;
      let staffList = res?.list || [];

      let conformLanguageService = staffList.filter(s => {
        let staffLang = s?.language_ids?.split(',') || [];
        return hasOnlyLangId
          ? staffLang.includes(serviceNeedLangIds[0])
          : staffLang.some(d => serviceNeedLangIds.includes(d))
      })
       setStaff(conformLanguageService);
      setAllStaff(res?.list);
    }
  })
  useEffect(() => {
    if (_selectService.visible) {
      form.setFieldsValue({ language_id: serviceNeedLangIds });
      runLang()
      module === 'after-sales' ? runStaff() :runStaff(params)
    }
  }, [_selectService.visible])
  const onChangeLang = (language_id) => {
    form.resetFields(['staff']);
    let conformLanguageService = allStaff.filter(d => d.language_ids.replace(/[\s]/g, '').split(',').includes(language_id));
    setStaff(conformLanguageService);
  }
  const onOk = () => {
    const { value: staffid } = form.getFieldValue('staff');
    const { language_ids, real_name: name, id } = staff.find(s => s.id == staffid)


    onSubmit && onSubmit({ id, name, language_ids })
    _selectService.setVisible(false)
  }
  const afterClose = () => {
    form.resetFields()
  }

  const customerLangHasDiff = new Set([...serviceNeedLangIds]).size > 1;
  return (
    <Modal
      title={title}
      visible={_selectService.visible}
      onCancel={() => _selectService.setVisible(false)}
      okText={intl.formatMessage({ id: 'app.global.ok' })}
      cancelText={intl.formatMessage({ id: 'app.global.cancel' })}
      onOk={onOk}
      afterClose={afterClose}
      getContainer={false}
    >
      <Form name="customer-service" form={form} component={false}>
        <Input.Group>
          <Row gutter={8}>
            <Col
              span={24}
              className="service-modal__title"
            >
              {desc}
            </Col>
            <Col span={6}>
              <Form.Item name="language_id" noStyle>
                <FieldSelect
                  placeholder={intl.formatMessage({ id: 'app.common.allLanguage' })}
                  option={lang?.list ?? []}
                  mapValue="id"
                  style={{ width: '100%' }}
                  onChange={onChangeLang}
                  allowClear
                  disabled={disabledLanguage}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="staff" noStyle>
                <FieldSelect
                  option={staff ?? []}
                  mapValue="id"
                  mapName="real_name"
                  placeholder={intl.formatMessage({ id: 'app.common.selectLanguage' })}
                  style={{ width: '100%' }}
                  labelInValue
                  renderItem={(v, item) => (
                    <div className="service-item">
                      <span>{v}</span>
                    </div>
                  )
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Input.Group>
      </Form>

      <div className="service-modal__tip" style={{ fontSize: 12 }}>
        {customerLangHasDiff && serviceNeedLangIds.length > 1 &&
          <p>
            <IconFont type="icon-alert-o" />{intl.formatMessage({ id: 'app.common.hasDiffLanguage' })}
          </p>
        }
        <p>
          <IconFont type="icon-alert-o" />{intl.formatMessage({ id: 'app.common.selectCustomerTip' })}
        </p>
      </div>
    </Modal>
  )
}
