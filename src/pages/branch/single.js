import { useState, useEffect } from 'react';
import { history, useIntl, useRequest, useParams } from 'umi';
import {
  message,
  Card,
  Input,
  Button,
  Radio,
  Switch,
  Select,
  TreeSelect,
} from 'antd';
import {_BranchCountry, BizForm, FieldSelect} from '@/components';
import services from '@/services';
import { basic } from '@/utils';

const layout = {};
export default function ({ route }) {
  const { formatMessage } = useIntl(); // 语言包工具
  const params = useParams(); // hook params 参数
  const [form] = BizForm.useForm(); // 创建表单实例
  const [countrys, setCountrys] = useState([]);
  const { data: branchData, run: getBranches } = useRequest(services.branchList, { manual: true }); // 获取部门列表
  const { data: dataCountry, run: getCountrys } = useRequest(services.queryCountry,
    {
      manual: true,
      onSuccess: data => {
        setCountrys(data?.list ?? []);
      }
    }); // 获取国家信息

  // 保存的异步操作
  const { loading, run } = useRequest(
    params.id ? services.branchUpdate : services.branchCreate,
    {
      manual: true,
      onSuccess: () => {
        message.success(
          formatMessage({ id: 'app.message.save.success' }),
        );
        history.push('/system/branch');
      },
    },
  );
  // 获取单个部门的详情
  const { run: runDetail } = useRequest(services.branchSingle, {
    manual: true,
    onSuccess: data => {
      data = basic.toFormData(data, {
        replace: { country_weight_ratio: 'data' },
        transform: ['parent_id']
      });
      if (params.id && data.parent_id !== '0') {
        // 如果不是作为一级部门 就重新取此部门对应所在国家
        parentDepartmentChange(data.parent_id);
      }

      form.setFieldsValue(data);
    },
  });

  // 监听 params 变化 触发详情接口
  useEffect(() => {
    params.id && runDetail({ id: params.id });
    getBranches();
    getCountrys();
  }, [params.id]);

  let branches = branchData?.list ?? [];
  let branchOption = basic.traverseTree(branches, {
    title: 'name',
    value: 'id',
  });
  const jobTypes = basic.formatDDIC('sys_department.job_type', true); // 部门类型 可选项
  const status = basic.formatDDIC('sys_department.status', true); // 部门状态 可选项
  const distributeTypes = basic.formatDDIC(
    'sys_department.distribute_type',
    true,
  ); // 分担模式可选项

  // 上级部分变化改变分单模式的国家数组
  const parentDepartmentChange = (value) => {

    form.setFields([{ name: 'data', value: [{}] }]);
    if (value === '0') {
      setCountrys(dataCountry?.list ?? []);
    } else {
      let item = basic.deepSearchCountry(branches, value);
      let newCountrys = item.map(r => ({ id: r.country_id, display_name: r.country_name }))
      setCountrys(newCountrys)
    }
  }
  // 表单提交
  const onSubmit = values => {
    // 售前的submit校验
    if(values.job_type === '1' && (values.data.length === 0 || values.data.some(v => !v?.country_id || !v?.ratio || !v?.weight))){
      message.warn(
        formatMessage({ id: 'app.message.shareOrderConfig' }),
      );
      return;
    }
    // 售后的submit校验
    if(Number(values.job_type) === 2 &&!values.customer_country?.length) {
      message.warn(
        formatMessage({ id: 'app.common.needAssignCountry' }),
      );
      return;
    }
    run(values)
  };
  const onValuesChange = changedValues => {
    if ('parent_id' in changedValues) {
      let item = basic.deepSearch(branches, changedValues.parent_id);
      if (item && item.distribute_type == 1) {
        message?.warn(
          formatMessage({ id: 'app.message.distributeWarning' }),
        );
      }
    }
  };
  return (
    <>
      <Card title={route.title} className="biz-card">
        <BizForm
          {...layout}
          onFinish={onSubmit}
          form={form}
          onValuesChange={onValuesChange}
          initialValues={{ status: '1', distribute_type: '1', parent_id: '0', job_type: undefined, data: [{}] }}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 10 }}
          footerLayout={{ span: 10, offset: 4 }}
          footer={
            <Button type="primary" htmlType="submit">
              {formatMessage({ id: 'app.global.save' })}
            </Button>
          }
        >
          <BizForm.Item
            name="name"
            label={formatMessage({ id: 'app.common.branchName' })} // 部门名称
            rules={[
              { required: true, message: formatMessage({ id: 'app.message.branchName' }) }
            ]}
          >
            <Input />
          </BizForm.Item>
          <BizForm.Item
            name="parent_id"
            label={formatMessage({ id: 'app.common.branchSuperior' })} // 上级部门
            rules={[
              { required: true, message: formatMessage({ id: 'app.message.branchLevel' }) }
            ]}

          >
            <TreeSelect
              disabled={!!params.id}
              onChange={(value, label, extra) => parentDepartmentChange(value, label, extra)}
              treeDefaultExpandAll
              treeData={[
                {
                  title: formatMessage({
                    id: 'app.common.aDepartment',
                  }),
                  value: '0',
                },
                ...branchOption,
              ]}
            />
          </BizForm.Item>
          <BizForm.Item
            name="job_type"
            label={formatMessage({ id: 'app.common.jobType' })} // 部门类型
            rules={[
              { required: true, message: formatMessage({ id: 'app.message.branchType' }) }
            ]}
          >
            <Radio.Group options={jobTypes} disabled={!!params.id}/>
          </BizForm.Item>
          <BizForm.Item
            name="status"
            label={formatMessage({ id: 'app.common.branchStatus' })}    // 部门状态
          >
            <Radio.Group options={status} />
          </BizForm.Item>
          <BizForm.Item
            name="remark"
            label={formatMessage({ id: 'app.common.remark' })}           // 备注
          >
            <Input.TextArea />
          </BizForm.Item>

          <BizForm.Item
            shouldUpdate={(prev, cur) => prev.job_type !== cur.job_type}
            noStyle
          >
            {
              ({ getFieldValue }) => {
                const job_type = getFieldValue('job_type')
                return Number(job_type) === 1 && (
                  <>
                    <BizForm.Partition
                      title={formatMessage({ id: 'app.common.distributeSet' })}
                    />

                    <BizForm.Item
                      name="distribute_type"
                      label={formatMessage({ id: 'app.common.branchDistribute' })}  // 分单模式
                    >
                      <Radio.Group options={distributeTypes} />
                    </BizForm.Item>
                  </>
                )
              }
            }
          </BizForm.Item>

          <BizForm.Item
            shouldUpdate={(prev, cur) =>
              (cur.parent_id !== undefined && prev.parent_id !== cur.parent_id) || prev.job_type !== cur.job_type
            }
            noStyle
          >
            {({ getFieldValue }) => {
              let parent_id = getFieldValue('parent_id'); // 取出当前部门的上级部门ID
              const job_type = getFieldValue('job_type')
              return Number(job_type) === 1 && (
                <BizForm.List name="data">
                  {(fields, { add, remove }) => {
                    return (
                      <>
                        <BizForm.Item wrapperCol={{ span: 10, offset: 4 }}>
                          <Button onClick={() => add()}>{formatMessage({id: 'app.common.addOrderSetting'})}</Button>
                        </BizForm.Item>
                        {fields.map(field => (
                          <BizForm.Item {...field} wrapperCol={{ span: 24 }}>
                            <_BranchCountry
                              option={countrys}
                              params={{ parent_id }}
                              onRemove={() => fields.length > 1 && remove(field.name)}
                            />
                          </BizForm.Item>
                        ))}
                      </>
                    )
                  }}
                </BizForm.List>
              );
            }}
          </BizForm.Item>

          <BizForm.Item
            shouldUpdate={(prev, cur) => prev.job_type !== cur.job_type}
            noStyle
          >
            {({ getFieldValue }) => {
              const job_type = getFieldValue('job_type')
              return Number(job_type) === 2 && (
                <>
                  <BizForm.Partition
                    title={formatMessage({ id: 'app.common.customerCountrySetting' })}
                  />
                  <BizForm.Item
                    shouldUpdate={(prev, cur) => prev.job_type !== cur.job_type}
                    label={formatMessage({id: 'app.common.assignCustomerCountry'})}
                    name="customer_country"
                  >
                    <FieldSelect
                      option={countrys}
                      mapName="display_name"
                      mapValue="id"
                      mode="multiple"
                      showArrow
                      placeholder={formatMessage({id: 'app.common.pleaseSelectCustomerCountry'})}
                    />
                  </BizForm.Item>
                </>
              )
            }}
          </BizForm.Item>

        </BizForm>
      </Card>
    </>
  );
}
