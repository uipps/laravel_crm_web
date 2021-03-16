import { useState, useEffect } from 'react';
import { useRequest, useIntl, useParams } from 'umi';
import services from '@/services';
import { DataSheet } from '..';
import { Form, Row, Col, Select, InputNumber, Divider, Button } from 'antd';
import { numeral } from '@/utils';
import styles from './styles.less';

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

export default function ({
  id: uuid,
  option,
  value = {},
  onRemove,
  params = {},
  onChange = () => { },
}) {
 
  const intl = useIntl();
  const superiorParams = useParams();
  const [data, setData] = useState([]);
  const defaultBranchName = intl.formatMessage({
    id: 'app.common.currentDepartment',
  }); // 当前部门名称的别名
  const { loading, run, cancel } = useRequest(services.branchCountryRate, {
    throttleInterval: 50,
    manual: true,
    onSuccess: resp => setData(dealWith(resp?.list ?? [])),
  });

  useEffect(() => {
    if (params.parent_id !== undefined && value.country_id) {
      run({ ...params, country_ids: value.country_id });
    }
  }, [params.parent_id, value.country_id]);
  // 国家选择改变时
  const onChangeCountry = ({ value: country_id, label: country_name }) => {
    onChange && onChange({ country_id, country_name });
  };
  // 所有数字输入框 失去焦点事件监听
  const onInputBlur = (key, e) => {
    let _data = data.map(item =>
      item.id === uuid
        ? {
          ...item,
          [key]: value[key],
        }
        : item,
    );
    setData(_data);
  };
  const total = data.reduce((pre, next) => pre + (next.ratio || 0), 0); // 计算总数据
  const dealWith = original => {
    if (!superiorParams.id) {
      // 业务性的ID存在时
      return [
        ...original,
        {
          id: uuid,
          country_name: value.country_name,
          department_name: defaultBranchName,
          _highlight: true,
        },
      ];
    } else {
      return original.map(item =>
        item.department_id == superiorParams.id
          ? {
            ...item,
            department_name: defaultBranchName,
            _highligh: true,
          }
          : item,
      );
    }
  };
  const columns = [
    {
      title: intl.formatMessage({ id: 'app.common.department' }),
      width: 100,
      align: 'center',
      dataIndex: 'department_name',
    },
    {
      title: intl.formatMessage({ id: 'app.common.country' }),
      width: 100,
      align: 'center',
      dataIndex: 'country_name',
    },
    {
      title: intl.formatMessage({ id: 'app.common.weight' }),
      width: 100,
      align: 'center',
      dataIndex: 'weight',
      render: v => v || '-',
    },
    {
      title: intl.formatMessage({ id: 'app.common.branchRatio' }),
      width: 100,
      align: 'center',
      dataIndex: 'ratio',
      render: v => (v && `${v} (${numeral(v / total).format('0.00%')})`) || '-',
    },
  ];
  return (
    <Row gutter={12} className={styles.lineItem}>
      <Col span={14}>
        <Form.Item
          {...layout}
          className="requiredIcon"
          // name="country_id"
          rules={[{ required: true, message: intl.formatMessage({ id: 'app.message.country' }) }]}
          label={intl.formatMessage({ id: 'app.common.branchCountry' })}
          extra={intl.formatMessage({ id: 'app.common.selectNeedCountry' })}
        >
          <Select
            onChange={onChangeCountry}
            labelInValue
            value={{ label: value.country_name, value: value.country_id }}
            dropdownRender={menu => {
              return (
                <>
                  {menu}
                  <Divider style={{ margin: '4px 0' }} />
                  <Button type="link" onClick={onRemove}>
                    {intl.formatMessage({
                      id: 'app.common.remove-distribute',
                    })}
                  </Button>
                </>
              );
            }}
          >
            {option.map(item => (
              <Select.Option key={item.id}>{item.display_name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          {...layout}
          className="requiredIcon"
          // name="weight"
          rules={[{ required: true, message: intl.formatMessage({ id: 'app.message.branchWeight' }) }]}
          label={intl.formatMessage({ id: 'app.common.branchWeight' })}
          extra={intl.formatMessage({ id: 'app.common.extraWeight' })}
        >
          <InputNumber
            style={{ width: '100%' }}
            onBlur={e => onInputBlur('weight', e)}
            value={value.weight}
            onChange={weight => {
              onChange({ ...value, weight });
            }}
          />
        </Form.Item>
        <Form.Item
          {...layout}
          className="requiredIcon"
          // name="ratio"
          rules={[{ required: true, message: intl.formatMessage({ id: 'app.message.branchRatio' }) }]}
          label={intl.formatMessage({ id: 'app.common.branchRatio' })}
          extra={intl.formatMessage({ id: 'app.common.extraRatio' })}
        >
          <InputNumber
            style={{ width: '100%' }}
            onBlur={e => onInputBlur('ratio', e)}
            value={value.ratio}
            onChange={ratio => {
              onChange({ ...value, ratio });
            }}
          />
        </Form.Item>
      </Col>
      <Col span={10}>
        <div style={{ height: '100%', display: 'flex' }}>
          {!!value.country_id && (
            <DataSheet
              style={{ margin: '-16px 0' }}
              rowClassName={record => (!!record._highligh ? 'highlight' : '')}
              loading={loading}
              dataSource={data}
              columns={columns}
            />
          )}
        </div>
      </Col>
    </Row>
  );
}
