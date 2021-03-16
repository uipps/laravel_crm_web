import { useState } from 'react'
import { history, useIntl, useRequest, useModel } from 'umi'
import services from '@/services'
import { Form, Input, Button } from 'antd'
import { IconFont, VerificationCode } from '@/components'
import { md5, store, layout } from '@/utils'
import style from './styles/login.less'

const layoutProps = {
  wrapperCol: { span: 18, offset: 3 },
}

function recursion(list = [], pKey = '') {
  return (
    Array.isArray(list) &&
    list.reduce((obj, item) => {
      let key = !!pKey ? `${pKey}-${item.code}` : item.code;
      return {
        ...obj,
        [key]: item.is_permitted,
        ...recursion(item.children, key),
      };
    }, {})
  );
}

export default function () {
  const { formatMessage } = useIntl(); // 国际化语言函数
  const { initialState, setInitialState } = useModel('@@initialState');
  const [errorTime, setErrorTime] = useState(0) // 错误统计次数
   const [form] = Form.useForm() // form表单实体
   const { run: doPermission } = useRequest(services.globalPermission, {
      manual: true,
      onSuccess: data => {
        let permission = layout.formatterAuthorityCode(data.list)
        store.set('permission', permission)
        let account = store.get('account')
        setInitialState({ ...initialState, permission, account })
        if (permission['nav:presale']) {
          window.location.href = '/pre-sales/dashboard'
        } else if (permission['nav:aftersale']) {
          window.location.href = '/after-sales/dashboard'
          /* window.location.href = '/after-sales/dashboard' */
        } 
      }
    })
  /**
   * 登陆异步请求函数
   **/
  const { run: doLoginRun, loading } = useRequest(services.accountLogin, {
    manual: true,
    onSuccess: result => {
      let { token, token_type, ...userInfo } = result
      store.set('token', `${token_type} ${token}`)
      store.set('account', userInfo)
      doPermission()
/*       window.location.href = '/' // 用JS重定向地址，为了让JS重新执行加载 */
    },
    onError: ({ info }) => {
      if (info.errorCode === 410) {
        setErrorTime(errorTime + 1) // 每次错误记录次数
        form.setFields([{
            name: 'password',
            errors: [errorTime === 2 ? formatMessage({ id: 'app.message.errorPassword' }) : info.errorMessage]
          }
        ])
      } else if (info.errorCode === 405 || info.errorCode === 3) {
        form.setFields([{
          name: 'email',
          errors: [ info.errorMessage]
        }
      ])
      } else { // 用户不存在
        form.setFields([{
            name: 'verify',
            errors: [info.errorMessage]
          }
        ])
      }
    }
  })
  // 表单提交
  function onFinish ({ email, password, verify }) {
    let values = {
      email,
      password: md5(password),
      ...(verify ? { vcode: verify.value, vcode_key: verify.key } : {})
    }
    doLoginRun(values) // 发起异步登陆
  }
  return (
    <div className={style.login}>
      <div className={style.loginContent}>
        <div className={style.loginSection}>
          <div className={style.loginSectionLogo} />
          <div className={style.loginSectionLabel}>
            {formatMessage({ id: 'app.login.desc' })}
          </div>
        </div>
        <div className={style.loginForm}>
          <div className={style.loginFormTitle}>
            {formatMessage({ id: 'app.login.title' })}
          </div>
          <Form
            {...layoutProps}
            form={form}
            name="basic"
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[{
                type: 'email',
                required: true, message: formatMessage({ id: 'app.message.loginEmail' })
              }]}
            >
              <Input 
                placeholder={formatMessage({ id: 'app.common.placeholder.email'})}
                addonBefore={<IconFont type="icon-user"/>} 
                size="large" 
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{
                required: true, message: formatMessage({ id: 'app.message.inputPassword' })
              }]}
            >
              <Input 
                type="password" 
                placeholder={formatMessage({ id: 'app.common.placeholder.password'})}
                addonBefore={<IconFont type="icon-lock"/>} 
                size="large" 
              />
            </Form.Item>
            {
              errorTime >= 3 && (
                <Form.Item
                  name="verify"
                  rules={[{
                    required: true, message: formatMessage({ id: 'app.message.inputPassword' })
                  }]}
                >
                  <VerificationCode addonBefore={<IconFont type="icon-lock"/>} size="large" />
                </Form.Item>
              )
            }
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={loading} block>
                {formatMessage({ id: 'app.login.submit' })}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
