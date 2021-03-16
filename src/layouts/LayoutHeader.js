import { useState } from 'react'
import {
  useModel,
  getLocale,
  setLocale,
  history,
  useLocation,
  useRequest,
  useIntl,
  useAccess
} from 'umi'
import { Layout, Menu, Dropdown, Avatar, Select, Button, Space } from 'antd';
import { MenuUnfoldOutlined, UserOutlined, DownOutlined } from '@ant-design/icons'
import { store, layout } from '@/utils'
import services from '@/services'
import Logo from '@/assets/logo.png';
import { IconFont } from '@/components'
// 系统可选语言列表
const locales = [
  // { name: 'Malaysia', value: 'ms-MY' },
  { name: 'Indonesia', value: 'id-ID' },
  { name: 'English', value: 'en-US'},
  { name: '简体中文', value: 'zh-CN' },
]
export default function({
  visible,
  logo,
  option,
  onNavClick
}) {
  if (!visible) return null // 直接返回null 不渲染
  const { initialState } = useModel('@@initialState')
  const access = useAccess()
  const location = useLocation() // hook location 取出当前路径
  const { formatMessage } = useIntl()
  const [status, setStatus] = useState(store.get('receive-status') === null ? 1 : store.get('receive-status') )
  const selectedKey = layout.getSelectedFromLocation(location.pathname) // 定位当前nav 选择的项目
  const { run } = useRequest(services.receiveOrder, {
    manual: true,
    onSuccess: () => {
      store.set('receive-status', Math.abs(status - 1))
      setStatus(Math.abs(status - 1))
    }
  })

  // model
  const { permission } = useModel('@@initialState').initialState

  const getPath = (key, options,) => {
    const menuItem = options.find(i => i.path === key)
    const needOptions = menuItem.children || [menuItem]
    const { path } = needOptions.find(i => (i.access === undefined || permission[i.access]))
    return { path, needOptions }
  }

  const onMenuClick = ({ key }) => {   // menu点击事件处理
    // 选取路径的逻辑
    const { path, needOptions } = getPath(key, option)
    let { path: realPath } = getPath(path, needOptions)

    if(!realPath.includes(key)) {
      realPath = Array.from(new Set(`${key}${realPath}`.split('/'))).join('/')
    }

    onNavClick && onNavClick(realPath);
  }
  const onModifyPassword = () => {  // 修改密码的事件
    history.replace('/account/password')
  }

  const onLogout = () => {  // 退出登陆的用户事件
    store.remove('token')
    store.remove('account')
    store.remove('permission')
    history.replace('/account/login')
  }
  const onReceive = e => {
    run({ order_status: status })
  }
  const onLocalChange  = local => {
    setLocale(local, true)
  }
  // 用户下拉菜单的配置
  const menu = (
    <Menu>
      <Menu.Item onClick={onModifyPassword}>
        { formatMessage({ id: 'app.global.modifyPassword'})}
      </Menu.Item>
      <Menu.Item onClick={onLogout}>
        { formatMessage({ id: 'app.global.logout'})}
      </Menu.Item>
    </Menu>
  )

  const curr_locale = getLocale() // 获取当前选择语言

  return (
    <Layout.Header className="crm-header">
      <div className="crm-header-left">
        <a href="/" className="layout-logo"><img src={Logo} /></a>
        <span className="crm-header-left__fold">
          <MenuUnfoldOutlined />
        </span>
        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          onClick={onMenuClick}
        >
          {Array.isArray(option) &&
            option.map(item =>
            ('access' in item ? access[item.access] : true ) &&
            (
              <Menu.Item key={item.path}>
                { formatMessage({ id: item.name})}
              </Menu.Item>
            ))}
        </Menu>
      </div>

      <div className="crm-header-action">
      {
        (initialState?.account?.receive_status ?? false) && (
          <Button
            data-receive={status}
            icon={
              <IconFont
                style={{ color: !status && '#FF3728' }}
                type={`icon-${status ? 'export' : 'minus-circle-o'}`} />
            }
            onClick={onReceive}
            style={{ marginRight: 16 }}
          >
            { formatMessage({ id: status ? 'app.common.beginOrderReceiving' : 'app.common.stopOrderReceiving' })}
          </Button>
        )
      }

        <Select style={{ width: 100 }} bordered={false} value={curr_locale} onChange={onLocalChange}>
          {
            locales.map(item => (
              <Select.Option key={item.value}>{item.name}</Select.Option>
            ))
          }
        </Select>
        <Dropdown overlay={menu}>
          <span className="crm-header__avatar" style={{ marginLeft: 16 }}>
            <Avatar icon={<UserOutlined />} size={16}/>
            {initialState?.account?.email}
            <DownOutlined />
          </span>
        </Dropdown>
      </div>
    </Layout.Header>
  );
}
