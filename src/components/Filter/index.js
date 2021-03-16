import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'antd';
import assets from './assets/index';
import { useIntl } from 'umi';
import { IconFont } from '@/components';
import './style.less';

// demo数据，开发时删除掉
const data = [
  {
    label: '名称很长的一个',
    id: 'k1',
    type: 'input',
    formatValue(val) {
      return val;
    },
  },
  {
    label: '国家',
    id: 'k2',
    options: [
      {
        value: 'all',
        label: '全部',
      },
      {
        value: 'k1',
        label: '第一个',
      },
    ],
    type: 'select',
  },
  {
    label: '名称',
    id: 'k3',
    type: 'input',
  },
  {
    label: '国家fdfhs ',
    id: 'k4',
    options: [
      {
        value: 'all',
        label: '全部',
      },
    ],
    type: 'select',
  },
  {
    label: '名称',
    id: 'k5',
    type: 'input',
  },
  {
    label: '国家',
    id: 'k6',
    type: 'datePicker',
  },
];

export default function(props) {
  const {
    values,
    items = data,
    headFilters = [],
    onSubmit,
    onChange,
    allowClear = true,
    initialValues = {},
    inputHandler,
    outputHandler,
  } = props;

  const layout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 15 },
  };

  const formatMessage = useIntl().formatMessage;

  useEffect(() => {
    // 没值不执行
    if(!values) return

    /*
    * 格式化传进来的值
    * */

    // 1.输入值的处理
    const _values = inputHandler && inputHandler(values) || values

    // 2.格式化每个字段
    const inputValues = Object.keys(_values).reduce((obj, key) => {
      let { inputFormat } = items.find(item => item.id === key) || {}

      return {
        ...obj,
        [key]: inputFormat && inputFormat(_values[key]) || _values[key],
      }
    }, {})

    // 清空已有的字段，以values作为当前的值
    const fields = Object.keys(form.getFieldValue()).reduce((obj, key) => {
      return { ...obj, [key]: undefined }
    }, {})

    form.setFieldsValue({ ...fields, ...inputValues })
  }, [values]);

  const [form] = Form.useForm();

  /*
  * 格式化传出去的值
  **/
  const formatOutput = (values) => {
    // 1.输出值的处理
    const _values = outputHandler && outputHandler(values) || values

    // 2.格式化每个字段
    const outputValues = Object.keys(_values).filter(k => _values[k] !== undefined && _values[k] !== '').reduce((obj, key) => {
      let { outputFormat } = items.find(item => item.id === key) || {}

      return {
        ...obj,
        [key]: outputFormat && outputFormat(_values[key]) || _values[key]
      }
    }, {})

    return outputValues
  }

  const handlerValuesChange = (changedValues, allValues) => {
    const key = Object.keys(changedValues)[0]
    const value = changedValues[key]
    const _allValues = formatOutput(allValues)

    onChange && onChange({ key, value, _allValues })
  };

  const handlerFinish = () => {
    const values = form.getFieldsValue()

    onSubmit && onSubmit(formatOutput(values));
  };

  const renderItem = item => {
    const { label, id, type, component, ...extra } = item;
    const { Component: insideComponent } = assets[type] || {}

    let Component = component instanceof Function ? component : insideComponent

    return (
      <Col className="flt__item" span={6} key={id}>
        <Form.Item label={label} labelAlign="right" name={id}>
          {React.cloneElement(
            <Component />,
            { allowClear, ...extra },
            null,
          )}
        </Form.Item>
      </Col>
    );
  };

  return (
    <Form
      className={`flt ${props.className}`}
      style={props.style}
      {...layout}
      form={form}
      initialValues={initialValues}
      onFinish={handlerFinish}
      onValuesChange={handlerValuesChange}
    >
      {Array.isArray(headFilters) && !!headFilters.length &&
        <Row className="flt__head_filter">
          {headFilters.map(item => renderItem(item))}
        </Row>
      }

      <Row className="flt__normal_filter">
        {Array.isArray(items) && items.map(item => renderItem(item))}

        {onSubmit && (
          <Col span={6} className="flt__item">
            <Form.Item label=" " colon={false}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<IconFont type="icon-search" />}
              >
                {formatMessage({ id: 'app.global.query' })}
              </Button>
            </Form.Item>
          </Col>
        )}
      </Row>
    </Form>
  );
}
