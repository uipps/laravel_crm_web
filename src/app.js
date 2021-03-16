import React from 'react';
import { history } from 'umi';
import { middleware, store } from '@/utils';
import services from '@/services';
import { ConfigProvider } from 'antd';

// request 请求函数配置
export const request = {
  prefix: '/api/v1',
  requestInterceptors: [middleware.requestInterceptors],
  responseInterceptors:[middleware.responseInterceptors],
  middlewares: [middleware.convertMap],
/*   errorHandler: middleware.errorHandler, */
  errorConfig: {
    errorPage: '/account/login',
    adaptor: middleware.adaptor,
  },
};
// 渲染前执行--- 判断用户是否登陆
export const render = async oldRender => {
  services.globalMap().then(({ data }) => {
    store.set('DDIC', data);
    if (!!store.get('token')) {
      oldRender();
    } else {
      history.push('/account/login');
      oldRender();
    }
  })
  .catch(() => {
    oldRender();
  })

};
// 全局状态
export const getInitialState = () => {
  let permission = store.get('permission');
  let account = store.get('account');
  let DDIC = store.get('DDIC');
  return { permission, account, DDIC };
};

// 全局统一的ConfigProvider配置
export const rootContainer = container => {
  const providerProps = {
     getPopupContainer: trigger => trigger ? trigger.parentNode : document.body
  };
  return React.createElement(ConfigProvider, providerProps, container);
};
