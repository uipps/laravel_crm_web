import { useEffect } from 'react'
import { history, useIntl, useRequest, useParams } from 'umi'
import { Card, Form, Input, Tree, Button } from 'antd'
import { TreeData } from '@/components'
import services from '@/services'
import { basic } from '@/utils'
import style from './styles/single.less'
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
}
export default function ({
  route
}) {
  const intl = useIntl(); // 语言包工具
  const params = useParams() // hook params 参数
  const [form] = Form.useForm() // 创建表单实例
  const { data } = useRequest(services.globalPermission) // 获取基础权限树
  // 获取详情信息
  const { run: runDetail } = useRequest(services.roleSingle, {
    manual: true,
    onSuccess: data => {
      data.privilege_ids = data.role_privileges
      form.setFieldsValue(data)
    }
  })
  // 保存或者修改详情信息
  const { run: runSave, loading } = useRequest(
    !!params.id ? services.roleUpdate : services.roleCreate,
    {
    manual: true,
    onSuccess: () => history.push('/system/role')
  })
  // 监听 params 变化 触发详情接口
  useEffect(() => {
    params.id && runDetail({ id: params.id })
  }, [params.id])

  const treeData = basic.authorityTree(data?.list ?? []) // 基础权限树格式化
  const expandedKeys = basic.expandedKeysTree(treeData) // 转换基础权限树

  // 保存事件
  const onSubmit = values => {
    values.id = params.id
    runSave(values)
  }

  return (
    <Card title={route.title} className={style.roleSingle}>
      <Form
        {...layout}
        form={form}
        onFinish={onSubmit}
        initialValues={{ status: false }}
      >
        <Form.Item
          name="name"
          label={intl.formatMessage({ id: 'app.common.roleName' })} //角色名称
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="remark"
          label={intl.formatMessage({ id: 'app.common.remark' })} // 备注
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="privilege_ids"
          label={intl.formatMessage({ id: 'app.common.roleAuthority' })}
          className={style.roleSingleItem}
        >
{/*           <Tree
            checkable
            checkStrictly
            treeData={treeData}
            expandedKeys={expandedKeys}
          /> */}
          <TreeData
            options={treeData}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 10, offset: 4 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            { intl.formatMessage({ id: 'app.global.save' })}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
