import { useEffect, useState } from 'react'
import { history, useRequest, useIntl, useModel } from 'umi'
import { useEventEmitter } from '@umijs/hooks';
import { pathToRegexp, Explain } from '@/utils'
import services from '@/services'
import * as orderCfg from '@/config/afterOrder';

import {
  Dialog,
  Filter,
  DataSheet,
  _SelectOrder,
  _SelectCustomer,
  _SelectClue,
  _MakeCall
} from '@/components';

let explain = new Explain(orderCfg)

const usableRow = [
  'askforcancel_cancel_succ',
  'askforcancel_cancel_fail',
/*   'audit_not' */
]
export default function ({
  location
}) {
  const { formatMessage } = useIntl(); // 语言包国际化方案函数
  const eventEmitter = useEventEmitter(); // 创建一个事件监听器

  const { initialState, setInitialState } = useModel('@@initialState');
  const { _selectCustomer, _selectOrder, _selectClue } = useModel('modal') // 弹窗组件数据模型
  const [orderModalType, setOrderModalType] = useState(null) // 选择订单弹窗的类型
  const [selectedKeys, setSelectedKeys] = useState([]) // 表格选中行的IDS集合
  let pathType = pathToRegexp('/after-sales/order/:pathType?').exec(location.pathname)
  let apiType = pathType && pathType[1]
  let { makeCall } = useModel('call')
  const { data, loading, run: runList } = useRequest(services.afterSalesOrderList, {
    manual: true,
    formatResult: ({ data }) => {
      data.allKeys = data.list.map(item => item.id)
      let { list = [] } = data;
      list = list.map(val => {
        val.country_name = val.country.cn_name;
        val.language_name = val.language.cn_name;
      })

      return data
    },
    onSuccess: resp => {
      const assets = initialState?.assets ??{}
      setInitialState({ ...initialState, assets: {...assets, ...resp.meta.order_stats} }) // 取出所有订单统计数据，存放在全局状态,
    }
  });
  const { run: orderArchive } = useRequest(services.afterSalesOrderArchive, {
    manual: true,
    onSuccess: () => {
      setSelectedKeys([])
      history.push({
        pathname: location.pathname,
        query: location.query
      })
    }
  })
  const { run: orderAudit } = useRequest(services.afterSalesOrderAudit, {
    manual: true,
    onSuccess: () => {
      setSelectedKeys([])
      history.push({
        pathname: location.pathname,
        query: location.query
      })
    }
  })
  useEffect(() => {
    apiType && runList({ apiType, ...location.query })
  }, [location])

  let table = explain.setRuleKey(apiType)
    .setFormatMessage(formatMessage)
    .generate({
      eventEmitter,
      selectedKeys,
      account: initialState.account,
      allKeys: data?.allKeys ?? []
    })

  eventEmitter.useSubscription(emitterKey => {
    switch (emitterKey) {
      case 'link-to:create':
        _selectCustomer.setVisible(true) // 创建手工订单
        break;
      case 'open-modal:replenish':
      case 'open-modal:redelivery':
      case 'open-modal:abnormal_redelivery':
      case 'open-modal:askforcancel':
        _selectOrder.setVisible(true)
        setOrderModalType(emitterKey.slice(emitterKey.indexOf(':') + 1, emitterKey.length))
        break
      case 'open-modal:clue':
        _selectClue.setVisible(true)
      case 'check-all':
        setSelectedKeys(data?.allKeys ?? [])
        break
      case 'uncheck-all':
        setSelectedKeys([])
        break
      case 'order-archive':
        orderArchive({ ids: selectedKeys })
        break
      case 'order-audit':
        Dialog.confirm({
          message: formatMessage({ id: 'app.message.auditOrder'}, { number: selectedKeys.length}),
          onOk: () => orderAudit({
            ids: selectedKeys,
            audit_status: 1
          })
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
  const onSearch = (values) => {
    history.push({
      pathname: location.pathname,
      query: { ...values }
    })
  }

  return (
    <>
      <Filter
        values={location.query}
        items={table.filter}
        style={{ marginBottom: 16 }}
        onSubmit={onSearch}
      />
      <DataSheet
        loading={loading}
        extra={table.header}
        action={table.footer}
        columns={table.columns}
        onChange={onTableChange}
        dataSource={data?.list ?? []}
        pagination={data?.pagination}
        rowSelection={
          usableRow.includes(apiType) ? {
            selectedRowKeys: selectedKeys,
            type: 'checkbox',
            onChange: selectedRowKeys => setSelectedKeys(selectedRowKeys)
          } : null}
      />
      <_SelectCustomer
        onOk={item => history.push(`/after-sales/order/create/general/${item.id}`)}
      />
      <_SelectOrder
        apiPrefix="_able"
        apiType={orderModalType}
        onOk={id => history.push(`/after-sales/order/${id}/edit/${orderModalType}?prefix=_able`)}
      />
      <_SelectClue
        onOk={cule_id => history.push(`/after-sales/order/create/clue/${cule_id}`)}
      />
      <_MakeCall />
    </>
  )
}
