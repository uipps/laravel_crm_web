import './style.less';
import React from 'react'
import { history, useIntl } from 'umi';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Exception } from '@/components'

import { _, pathToRegexp, layout } from '@/utils';
import LayoutHeader from './LayoutHeader';
import LayoutAside from './LayoutAside';
import navs from '@/config/menu';

export default function ({ location, children, route }) {
  // 导航点击时
  function onRouteChange(path) {
    history.replace(path);
  }
  let { formatMessage } = useIntl();
  let layoutConfig = layout.getConfigFromRoute(route.routes)
  const currentMatchPaths = Object.keys(layoutConfig).filter(item => pathToRegexp(`${item}(.*)`).test(location.pathname))
  const currentPathConfig = currentMatchPaths.length
    ? layoutConfig[currentMatchPaths[currentMatchPaths.length - 1]]
    : undefined;
  return (
    <Layout className="crm-layout">
      <LayoutHeader
        option={navs}
        onNavClick={onRouteChange}
        visible={!currentPathConfig.hideNav}
      />
      <Layout.Content className="crm-container">
        <LayoutAside
          assets={navs}
          onClick={onRouteChange}
          isMenu={!currentPathConfig.hideMenu}
          visible={(currentPathConfig.hideMenu && currentPathConfig.hideNav)}
        />
        <div className="crm-content">
          <Exception.WithBoundary formatMessage={formatMessage}>
            <Exception.WithException currentPathConfig={currentPathConfig}>
              {React.cloneElement(children, { wjb: 122 })}
            </Exception.WithException>
          </Exception.WithBoundary>
        </div>
      </Layout.Content>
    </Layout>
  );
}
