import { useIntl, useRequest } from 'umi'
import { Card, Form, Input, Button, message } from 'antd'
import services from '@/services'
import { md5, store } from '@/utils'
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
}
export default function ModifyPassword ({
  route
}) {
  const { formatMessage } = useIntl(); // 语言包工具
  const { loading, run } = useRequest(services.staffModify, { 
    manual: true,
    onSuccess: () => {
      message.success(formatMessage({id: 'app.message.edit.success'}))
      store.remove('token')
      store.remove('account')
      store.remove('permission')
      history.replace('/account/login')
    }
  })
  const onFinish = (values) => {
 
    values = Object.keys(values).reduce((obj, key) => ({ ...obj, [key]: md5(values[key])}) , {})
    run(values)
  }
  return (
    <>
     <Card title={route.title}>
        <Form {...layout} onFinish={onFinish}>
          <Form.Item
            name="old_password"
            label={formatMessage({ id: 'app.common.oldPassword' })}
            rules={[
              { required: true }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="new_password"
            label={formatMessage({ id: 'app.common.newPassword' })}
            rules={[
              { required: true  },
              {
                pattern: new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/),
                message: formatMessage({ id: 'app.message.needPassword' }),
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="new_password_confirmation"
            label={formatMessage({ id: 'app.common.confirmPassword' })}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator: (rule, value) => {
                  if (!value || getFieldValue('new_password') === value) {
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
          </Form.Item>
          <Form.Item wrapperCol={{ span: 10, offset: 4 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              { formatMessage({ id: 'app.global.save' })}
            </Button>
          </Form.Item>
        </Form>
     </Card>
    </>
  )
}
