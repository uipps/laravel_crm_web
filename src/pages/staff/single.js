import { useEffect } from 'react';
import { history, useParams, useIntl, useRequest } from 'umi';
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
import { _StaffLang, Partition, BizForm } from '@/components';
import services from '@/services';
import { basic } from '@/utils';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};
export default function({ location, route }) {
  const { formatMessage } = useIntl(); // 语言包工具
  const params = useParams(); // hook params 参数
  const [form] = BizForm.useForm(); // 创建表单实例
  const { data: branchData } = useRequest(services.branchListAble); // 获取部门列表
  const { data: roleData } = useRequest(services.roleListAble);
  const { data: dataLangs } = useRequest(services.langList); // 获取语言列表信息
  // 保存的异步操作
  const { loading, run } = useRequest(
    params.id ? services.staffUpdate : services.staffCreate,
    {
      manual: true,
      onSuccess: () => {
        history.push('/system/staff');
      },
    },
  );
  // 获取单个部门的详情
  const { run: runDetail } = useRequest(services.staffSingle, {
    manual: true,
    onSuccess: data => {
      data = basic.toFormData(data, {
        replace: { language_weight_ratio: 'data' },
        transform: ['department_id'],
      });
      form.setFieldsValue(data);
    },
  });
  // 监听 params 变化 触发详情接口
  useEffect(() => {
    params.id && runDetail({ id: params.id });
  }, [params.id]);

  const langs = dataLangs?.list ?? [];
  const branches = branchData?.list ?? [];
  const roles = roleData?.list ?? [];
  const branchOption = basic.traverseTree(branches, {
    title: 'name',
    value: 'id',
  });
  const levelTypes = basic.formatDDIC('user.level_type', true); // 员工类型 可选项
  const status = basic.formatDDIC('user.status', true); // 员工状态 可选项
  const distributeTypes = basic.formatDDIC(
    'sys_department.distribute_type',
    true,
  ); // 分担模式可选项
  // 表单提交
  const onSubmit = values => run(values);
  let children = (
    <BizForm
      form={form}
      onFinish={onSubmit}
      initialValues={{ status: '1', level: '1', department_id: '0' }}
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
        name="real_name"
        label={formatMessage({ id: 'app.common.staffName' })} // 员工名称
        rules={[
          { required: true, message: formatMessage({ id: 'app.message.staffName' })}
        ]}
      >
        <Input />
      </BizForm.Item>
      <BizForm.Item
        name="password"
        label={formatMessage({ id: 'app.common.staffPassword' })} // 员工密码
        rules={[
          { required: !params.id },
          {
            pattern: new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/),
            message: formatMessage({ id: 'app.message.needPassword' }),
          },
        ]}
      >
        <Input.Password />
      </BizForm.Item>
      <BizForm.Item
        name="password_confirmation"
        label={formatMessage({ id: 'app.common.rePassword' })} // 员工确认密码
        rules={[
          { required: !params.id },
          ({ getFieldValue }) => ({
            validator: (rule, value) => {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                formatMessage({ id: 'app.message.rePassword' }),
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </BizForm.Item>
      <BizForm.Item
        name="email"
        label={formatMessage({ id: 'app.common.staffEmail' })} // 员工邮件
        rules={[
          { required: true, message: formatMessage({ id: 'app.message.staffEmail' })}
        ]}
      >
        <Input />
      </BizForm.Item>
      <BizForm.Item
        name="department_id"
        label={formatMessage({ id: 'app.common.staffBranch' })} // 员工所在部门名称
        rules={[
          { required: true, message: formatMessage({ id: 'app.message.staffBranch' })}
        ]}
      >
        <TreeSelect
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
        name="role_id"
        label={formatMessage({ id: 'app.common.staffRole' })} // 员工角色
        rules={[
          { required: true, message: formatMessage({ id: 'app.message.staffRole' })}
        ]}
      >
        <Select>
          {roles.map(({ name: label, id: value }) => (
            <Select.Option key={value}>{label}</Select.Option>
          ))}
        </Select>
      </BizForm.Item>
      <BizForm.Item
        name="level"
        label={formatMessage({ id: 'app.common.jobType' })} // 员工岗位类型
        required
      >
        <Radio.Group options={levelTypes} />
      </BizForm.Item>
      <BizForm.Item
        name="status"
        label={formatMessage({ id: 'app.common.staffStatus' })} // 员工状态
        required
      >
        <Radio.Group options={status} />
      </BizForm.Item>
      <BizForm.Item
        name="erp_id"
        label="ERP ID" // 员工状态
      >
        <Input />
      </BizForm.Item>
      <BizForm.Partition
        title={formatMessage({ id: 'app.common.distributeSet' })}
      />
      <BizForm.List name="data">
        {(fields, { add, remove }) => (
          <>
            <BizForm.Item wrapperCol={{ span: 10, offset: 4 }}>
              <Button onClick={() => add()}>增加分单设置</Button>
            </BizForm.Item>
            {fields.map(field => (
              <BizForm.Item {...field} wrapperCol={{ span: 24 }}>
                <_StaffLang
                  option={langs}
                  onRemove={() => remove(field.name)}
                />
              </BizForm.Item>
            ))}
          </>
        )}
      </BizForm.List>
    </BizForm>
  );
  if (params.id) {
    return children;
  }
  return (
    <>
      <Card title={route.title} className="biz-card">
        {children}
      </Card>
    </>
  );
}
