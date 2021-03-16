import { useState, useEffect } from 'react';
import { useIntl, useRequest, useModel } from 'umi';
import { useEventEmitter } from '@umijs/hooks';
import services from '@/services';
import { pathToRegexp, Explain } from '@/utils'
import preOrderCfgs from '@/config/preOrder';

import {
  DataSheet,
  Dialog,
} from '@/components';

const explain = new Explain(preOrderCfgs)
export default function ({
  history,
  location,
  match,
  route
}) {
  let { formatMessage } = useIntl(); // 语言包国际化方案函数
  let eventEmitter = useEventEmitter(); // 创建一个事件监听器
  let { initialState, setInitialState } = useModel('@@initialState');
  let { run: runRepeat } = useRequest(services.preOrderRepeatSet, {
    manual: true,
    onSuccess: () => {
      history.push({
        ...location
      })
    }
  })
  let { data, loading } = useRequest(services.preSalesOrderDetail, {
    defaultParams: [{
      apiType: 'repeat_list',
      ...match.params
    }],
    onSuccess: resp => {
      const assets = initialState?.assets ??{}
      setInitialState({ ...initialState, assets: {...assets, ...resp.meta.order_stats} }) // 取出所有订单统计数据，存放在全局状态,
    }
  });
  let columns = explain.setRuleKey('repeat_list').setFormatMessage(formatMessage).generateColumns({ eventEmitter })
  eventEmitter.useSubscription(data => {
    let [emitterKey, ...ids] = data.split(':')
    switch (emitterKey) {
      case 'reset-valid':
        Dialog.confirm({
          message: formatMessage({ id: 'app.message.validOrderCurrent'}),
          onOk: () => runRepeat({ ids, revoke_distribute: 1 })
        })
        break
      case 'reset-invalid':
        Dialog.confirm({
          message: formatMessage({ id: 'app.message.invalidOrderCurrent'}),
          onOk: () => runRepeat({ ids, revoke_distribute: -1 })
        })
        break
      default:
        let { order_no, customer_name, tel } = (data?.list ?? [])[emitterKey]
        makeCall({ order_no, customer_name, tel })
       break
    }
  })
    // 数据表改变事件
  const onTableChange = (query) => {
    history.push({
      pathname: location.pathname,
      query: { ...location.query, ...query }
    })
  }
  return (
    <>
      <DataSheet
        columns={columns}
        loading={loading}
        dataSource={data?.list ?? []}
        onChange={onTableChange}
        pagination={data?.pagination}
      />
    </>
  );
}

