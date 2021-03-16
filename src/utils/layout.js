import { _, memoizeOne, pathToRegexp } from '.';
/* function formatter(routes, layoutConfig = {}) {
  routes
    .filter(item => !('redirect' in item))
    .map(route => {
      const {
        menu = true,
        layout = true,
        unaccessible = false,
        path,
        
        routes: childrenRoutes,
      } = route;
      layoutConfig[path] = { layout, unaccessible, menu };
      if (childrenRoutes && childrenRoutes.length) {
        let childLayoutConfig = formatter(childrenRoutes);
        layoutConfig = { ...layoutConfig, ...childLayoutConfig };
      }
    });
  return layoutConfig;
} */
function formatterAuthorityCode (rules) {
  let newRules = []
  let oldRules = [].concat(rules)
  let permission = {}
  while (oldRules.length > 0) {
    let item = oldRules.shift()
    let { name, parent_id, code, is_menu, is_permitted, children } = item
    newRules.push({ 
      name, 
      code, 
      type: is_menu === 1 ? (parent_id  === 0 ? 'nav' : 'menu') : 'router', 
      permitted: is_permitted 
    })
    if (Array.isArray(children)) {
      let _childs = children.map(d => ({ ...d, code: `${code}-${d.code}` }))
      oldRules = [].concat(oldRules, _childs)
    }
  }
  while (newRules.length > 0) {
    let item = newRules.shift()
    let { code, type, permitted } = item
    permission[`${type}:${code}`] = permitted
  }
  return permission
}
function formatter(
  routes = [],
  prefix = '',
  base = '/',
  parentRouteLayoutConfig = {
    hideMenu: false,
    hideNav: false,
  },
  LayoutConfig = {},
) {
  routes
    .filter(item => item && !item.path?.startsWith('http'))
    .map(route => {
      const { layout, indexRoute, path = '', routes, unaccessible } = route;

      // 继承父路由的 layout 配置
      let hideNav = parentRouteLayoutConfig.hideNav;
      let hideMenu = parentRouteLayoutConfig.hideMenu;

      // 子路由的 layout 配置 优先级更高
      switch (layout) {
        case undefined:
          hideMenu = hideMenu;
          hideNav = hideNav;
          break;
        case true:
          hideMenu = false;
          hideNav = false;
          break;
        case false:
          hideMenu = true;
          hideNav = true;
          break;
        default:
          hideMenu = layout.hideMenu === undefined ? hideMenu : layout.hideMenu;
          hideNav = layout.hideNav === undefined ? hideNav : layout.hideNav;
      }

      // 拼接 path
      const absolutePath = path.startsWith('/') ? path : `${base}${base === '/' ? '' : '/'}${path}`;

      LayoutConfig[`${prefix}${absolutePath}`] = {
        hideMenu,
        hideNav,
        unAccessible: unaccessible || false,
      };

      // 拼接 childrenRoutes, 处理存在 indexRoute 时的逻辑
      const childrenRoutes = indexRoute
        ? [
            {
              path,
              layout,
              ...indexRoute,
            },
          ].concat(routes || [])
        : routes;

      // 拼接返回的 layout 数据
      if (childrenRoutes && childrenRoutes.length) {
        const result = formatter(
          childrenRoutes,
          prefix,
          absolutePath,
          {
            hideMenu,
            hideNav,
          },
          LayoutConfig,
        );
        LayoutConfig = { ...LayoutConfig, ...result };
      }
    });
  return LayoutConfig;
}
function getSelectedFromLocation(pathname, prefix = '') {
  let rules = `${prefix}/:selectedKey/(.*)?`;
  let regexp = pathToRegexp(rules).exec(pathname);
  let selectedKey = regexp && regexp[1] ? `/${regexp[1]}` : '/';
  return selectedKey;
}

function getMenuFromLocation(pathname, option) {
  let regexp = pathToRegexp('/:navType/:menuType/(.*)?').exec(location.pathname)
  let [currentPath, navType, menuType, childType] = regexp || []
  let { 
    path: rootPath, 
    children: menus = [], 
    title 
  } = _.find(option, { path: `/${navType}` }) || {};
  if (navType === 'system') { // 特殊的处理
    childType = menuType
    menuType = navType
    
  }
  let { 
    path: menuPath,
    children: options = [], 
    name: menuLabel 
  } = _.find(menus, { path: `/${menuType}` }) || {};
  return {
    rootPath,
    menus,
    menuKey: menuPath,
    optionKey: childType ? `${menuPath}/${childType}` : menuPath,
    menuLabel,
    options,
  };
}
export default {
  getConfigFromRoute: memoizeOne(formatter, _.isEqual),
  getSelectedFromLocation,
  getMenuFromLocation,
  formatterAuthorityCode
};
