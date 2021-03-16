import { useState, useEffect } from 'react';
import { useIntl, useRequest, useModel } from 'umi';
import { useEventEmitter } from '@umijs/hooks';

import { Button, Modal } from 'antd';
import services from '@/services';
import { pathToRegexp, Explain, qs } from '@/utils'
import preOrderCfgs from '@/config/preOrder';

import {
  Filter,
  DataSheet,
  SelectAction,
  _OrderModal,
  _SelectOrder,
  _SelectService,
  Dialog,
  _MakeCall
} from '@/components';

const explain = new Explain(preOrderCfgs)
const usableRow = ['distribute_not', 'distributed', 'repeat', 'askforcancel_cancel_succ', 'askforcancel_cancel_fail'];

export default function ({
  history,
  location,
  match,
  route
}) {
  let { formatMessage } = useIntl(); // 语言包国际化方案函数
  let eventEmitter = useEventEmitter(); // 创建一个事件监听器
  let [selectedKeys, setSelectedKeys] = useState([]) // 表格选中行的IDS集合
  const [orderModalType, setOrderModalType] = useState(null) // 选择订单弹窗的类型
  const [serviceNeedLangIds, setServiceNeedLangIds] = useState([]);

  const [btnControl, setBtnControl] = useState({
    showBtn: false,
    disabled: false
  })
  let apiType = pathToRegexp('/pre-sales/order/:pathType?').exec(location.pathname)
  let columnType = apiType[1]
  apiType = apiType[1]

  let { initialState, setInitialState } = useModel('@@initialState');
  let { _selectOrder, _selectService, customerService } = useModel('modal');
  let { makeCall } = useModel('call')
  let { data, loading, run: runList } = useRequest(services.preSalesOrderList, {
    manual: true,
    formatResult: ({ data }) => {
      data.allKeys = data.list.map(item => item.id)
      return data
    },
    onSuccess: resp => {
      const assets = initialState?.assets ?? {}
      const distribute_btn_status = resp.distribute_btn_status;   //  1 没有单可分配 2 分配中 3 暂未分单 4 无权限

      setInitialState({ ...initialState, assets: { ...assets, ...resp.meta.order_stats } }) // 取出所有订单统计数据，存放在全局状态,

      setBtnControl({
        showBtn: distribute_btn_status !== 4,
        disabled: distribute_btn_status !== 3
      })
    }
  });
  const { run: runDistribute } = useRequest(services.preOrderDistribute, {
    manual: true,
    onSuccess: () => {
      setSelectedKeys([])
      history.push({ ...location })
    }
  })
  const { run: runArchive } = useRequest(services.preSalesOrderArchive, {
    manual: true,
    onSuccess: () => {
      setSelectedKeys([]);
      history.push({ ...location });
    }
  })
  const { run: runRepeat } = useRequest(services.preOrderRepeatSet, {
    manual: true,
    onSuccess: () => {
      history.push({
        ...location
      })
    }
  })
  const { run: runStartDistributOrder, loading: distributOrderLoading } = useRequest(services.preStartDistribute, {
    manual: true,
    onSuccess: (res, params) => {
      setTimeout(() => {
        setBtnControl((pre) => ({ ...pre, disabled: false }));
      }, 8000);
    },
    onError: (error) => {
      setBtnControl((pre) => ({ ...pre, disabled: false }));
    }
  })
  useEffect(() => {
    runList({ apiType, ...location.query })
  }, [location])
 
  let table = explain.setRuleKey(columnType)
    .setFormatMessage(formatMessage)
    .generate({
      eventEmitter,
      selectedKeys,
      allKeys: data?.allKeys ?? [],
      ...btnControl
    })
  eventEmitter.useSubscription(emitterKey => {
    switch (emitterKey) {
      case 'link-to:create':
        history.push('/pre-sales/order/create/general') // 创建手工订单
        break
      case 'open-modal:replenish':
      case 'open-modal:redelivery':
      case 'open-modal:abnormal_redelivery':
      case 'open-modal:askforcancel':
        _selectOrder.setVisible(true)
        setOrderModalType(emitterKey.slice(emitterKey.indexOf(':') + 1, emitterKey.length))
        break
      case 'check-all':
        setSelectedKeys(data?.allKeys ?? [])
        let language_ids = (data?.list || []).map(s => String(s.language_id)); 
        setServiceNeedLangIds(language_ids)
        break
      case 'uncheck-all':
        setSelectedKeys([])
        setServiceNeedLangIds([])
        break
      case 'order-distributed-staff':  
        _selectService.setVisible(true)
        break;
      case 'cancel-distributed':
        Dialog.confirm({
          message: formatMessage({ id: 'app.message.cancelDistributed' }, { number: selectedKeys.length }),
          onOk: () => runDistribute({
            ids: selectedKeys,
            revoke_distribute: 1
          })
        })
        break;
      case 'reset-valid':
        Dialog.confirm({
          message: formatMessage({ id: 'app.message.validOrder' }, { number: selectedKeys.length }),
          onOk: () => runRepeat({
            ids: selectedKeys,
            status: 1
          })
        })
        break
      case 'reset-invalid':
        Dialog.confirm({
          message: formatMessage({ id: 'app.message.invalidOrder' }, { number: selectedKeys.length }),
          onOk: () => runRepeat({
            ids: selectedKeys,
            status: -1
          })
        })
        break
      case 'startDistributOrder':  // 开始分单
        Dialog.confirm({
          message: formatMessage({ id: 'app.message.startDistributOrder' }),
          confirmLoading: distributOrderLoading,
          onOk: () => {
            setBtnControl((pre) => ({ ...pre, disabled: true }));
            runStartDistributOrder({});
          }
        })
        break
      case 'order-archive':
        runArchive({ ids: selectedKeys })
        break
      default:
        let { order_no, customer_name, tel } = (data?.list ?? [])[emitterKey]
        makeCall({ order_no, customer_name, tel })
        break
    }
  })
  // Filter 搜索
  const onSearch = (values) => {
    history.push(location.pathname + '?' + qs.stringify(values, { arrayFormat: 'indices', encode: false }))
  }
  // 数据表改变事件
  const onTableChange = (query) => {
    history.push(location.pathname + '?' + qs.stringify(query, { arrayFormat: 'indices', encode: false }))
  }
  // 选择客服后的回调
  const onServiceOk = (values) => {
    runDistribute({
      ids: selectedKeys,
      pre_sale_id: values.id,
      revoke_distribute: 0
    })
  }

  // 选中订单
  const selectedRow = (selectedRowKeys, selectedRows) => {
    let language_id = selectedRows.map(s => String(s.language_id));
    setServiceNeedLangIds(language_id)
    setSelectedKeys(selectedRowKeys)
  }

  return (
    <>
      <Filter
        values={{...qs.parse(location.query)}}
        items={table.filter}
        style={{ marginBottom: 16 }}
        onSubmit={onSearch}
      />

      <DataSheet
        extra={table.header}
        columns={table.columns}
        loading={loading}
        action={table.footer}
        dataSource={data?.list ?? []}
        onChange={onTableChange}
        pagination={data?.pagination}
        rowSelection={
          usableRow.includes(apiType) ? {
            selectedRowKeys: selectedKeys,
            type: 'checkbox',
            onChange: selectedRow
          } : null}
      />
      <_SelectOrder
        platform="pre"
        apiPrefix="_able"
        apiType={orderModalType}
        onOk={id => history.push(`/pre-sales/order/${id}/edit/${orderModalType}?prefix=_able`)}
      />
      <_SelectService
        onSubmit={onServiceOk}
        serviceNeedLangIds={serviceNeedLangIds}
        title={formatMessage({ id: 'app.common.selectService' })}
        desc={formatMessage({ id: 'app.message.orderAllocation' })}
      />
      <_MakeCall />
    </>
  );
}

