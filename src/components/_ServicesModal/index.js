import { useEffect } from 'react';

import { useIntl, useRequest, useModel } from 'umi';
import { Modal, Form, Row, Col } from 'antd';
import { FieldSelect } from '..';
import services from '@/services';
const preService = services.pre;

export default function({ langs = [] }) {
  const intl = useIntl(); // 语言包国际化方案函数
  const [form] = Form.useForm();
  const { servicesModal } = useModel('order');
  const { data, run, mutate } = useRequest(preService.querySericeCustomer, {
    manual: true,
    cacheKey: 'customer-list',
  });
  useEffect(() => {
    servicesModal.visible && run();
  }, [servicesModal.visible]);

  function onSubmit() {
    form.submit();
    servicesModal.setVisible(false);
  }
  function onChange(value) {
    mutate(data => {
      return {
        ...data,
        list: data.list.map(d => ({ ...d, disabled: d.language_ids != value })),
      };
    });
  }
  return (
    <Modal
      title={intl.formatMessage({ id: 'app.common.selectService' })}
      visible={servicesModal.visible}
      onCancel={() => servicesModal.setVisible(false)}
      destroyOnClose
      okText={intl.formatMessage({ id: 'app.global.ok' })}
      cancelText={intl.formatMessage({ id: 'app.global.cancel' })}
      onOk={onSubmit}
    >
      <Form name="services" form={form}>
        <Row gutter={16}>
          <Col span={24}>{intl.formatMessage({ id: 'app.message.orderAllocation' })}</Col>
          <Col span={8}>
            <Form.Item>
              <FieldSelect
                placeholder={intl.formatMessage({ id: 'app.common.allLanguage' })}
                option={langs}
                mapValue="id"
                onChange={onChange}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item name="pre_sale">
              <FieldSelect  
                placeholder={intl.formatMessage({ id: 'app.common.selectService' })}
                option={data?.list ?? []}
                mapValue="id"
                mapName="real_name"
                labelInValue
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <span className="ant-form-item-extra" style={{ fontSize: 12 }}>
              选择语言后将匹配符合该语言的客服。
              订单语言与客服语言不符合的客服将置灰不可选。
            </span>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
