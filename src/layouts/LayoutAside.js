import { useIntl, useLocation, useModel, useAccess, Access } from 'umi';
import { Menu, Badge} from 'antd';
import { IconFont } from '@/components';
import { _, pathToRegexp, layout } from '@/utils';
import NAV_OPTION from '@/config/menu';

export default function({ isMenu, visible, assets, onClick }) {
  if (visible) return null; // 可见性返回
  const { formatMessage } = useIntl(); // 语言包国际化方案函数
  const { initialState, setInitialState } = useModel('@@initialState');
  const location = useLocation();
  const access = useAccess()
  const { permission } = useModel('@@initialState').initialState
  let {
    menuKey,
    rootPath,
    menus = [],
    menuLabel,
    options,
    optionKey
  } = layout.getMenuFromLocation(location.pathname, NAV_OPTION);
  // 获取path路径,处理/路径
  function getPath (path) {
    path = `${rootPath}${path}`;
    return Array.from(new Set(path.split('/'))).join('/');
  }
  // 菜单点击时
  function onMenuClick({ key }) {
    // 选取路径的逻辑
    const menuItem = menus.find(i => i.path === key)
    const needOptions = menuItem.children || [menuItem]
    const { path } = needOptions.find(i => (i.access === undefined || permission[i.access]))

    onClick && onClick(getPath(path));
  }
  // 自定义菜单
  function onItemClick(path, e) {
    e.stopPropagation();
    onClick && onClick(getPath(path));
  }
  const assetsStats = initialState?.assets ?? {}

  return (
    <aside className="crm-aside">
    {
      menus.length > 0 && (
        <Menu
          style={{ width: 60 }}
          className="crm-aside-left"
          theme="dark"
          onClick={onMenuClick}
          selectedKeys={[menuKey]}
        >
          {menus.map(item =>
            ('access' in item ? access[item.access] : true ) && (
            <Menu.Item key={item.path}>
              <IconFont type={item.icon} />
            </Menu.Item>
          ))}
        </Menu>
      )
    }

      {(isMenu && !!options.length) && (
        <div className="crm-aside-right">
          <span className="crm-aside-right--label">
            { formatMessage({ id: menuLabel })}
          </span>
          <ul className="crm-menu" style={{ width: 200 }}>
            {options.map(({ children, name, path, dataKey, dataStatus, ...item}) =>
            ('access' in item ? access[item.access] : true ) &&
            (
              <li data-id={path} key={path} className="crm-menu-item">
                <div
                  data-checked={optionKey === path}
                  className="crm-menu--label parent"
                  onClick={e => onItemClick(path, e)}
                >
                  { formatMessage({ id: name })}
                  {(dataKey && dataKey in assetsStats) && <span data-status={dataStatus}>{assetsStats[dataKey]}</span>}
                </div>
                {Array.isArray(children) && (
                  <ul className="crm-menu">
                    {children.map(child =>
                      ('access' in child ? access[child.access] : true ) &&
                    (
                      <li
                        data-id={child.path}
                        key={child.path}
                        className="crm-menu-item"
                      >
                        <div
                          data-checked={optionKey === child.path}
                          className="crm-menu--label"
                          onClick={e => onItemClick(child.path, e)}
                        >
                          { formatMessage({ id: child.name }) }
                          {
                            (child.dataKey && child.dataKey in assetsStats) &&
                            <span data-status={child.dataStatus}>
                            {assetsStats[child.dataKey]}</span>
                          }
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
