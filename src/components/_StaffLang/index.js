import { useState, useEffect } from 'react';
import { useRequest, useIntl, useParams } from 'umi';
import { Form, Row, Col, Select, InputNumber, Divider, Button } from 'antd';
import { _, numeral } from '@/utils';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

export default function({
  id: uuid,
  option,
  value = {},
  onRemove,
  params = {},
  onChange = () => {},
}) {
  const intl = useIntl(); // 获取语言方案
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(value);
  }, [value]);
  const onValuesChange = value => {
    let values = form.getFieldValue();
    onChange(values);
  };
  return (
    <Form
      component={false}
      onValuesChange={_.throttle(onValuesChange, 500)}
      form={form}
    >
      <Form.Item
        {...layout}
        name="language_id"
        label={intl.formatMessage({ id: 'app.common.staffClangName' })}
        extra={intl.formatMessage({ id: 'app.common.selectNeedLang' })}
      >
        <Select
          dropdownRender={menu => {
            return (
              <>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <Button type="link" onClick={onRemove}>
                  {intl.formatMessage({ id: 'app.common.removeLang' })}
                </Button>
              </>
            );
          }}
        >
          {option.map(item => (
            <Select.Option key={item.id}>{item.name}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        {...layout}
        name="weight"
        label={intl.formatMessage({ id: 'app.common.weight' })}
        extra={intl.formatMessage({ id: 'app.common.extraWeight' })}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        {...layout}
        name="ratio"
        label={intl.formatMessage({ id: 'app.common.branchRatio' })}
        extra={intl.formatMessage({ id: 'app.common.extraWeight' })}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  );
}
