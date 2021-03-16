import { _TransferTable, Filter } from '@/components';
import { Tabs, message } from 'antd';
import { useIntl, useRequest, history, Link, useModel } from 'umi';
import { store, _, basic, Explain, qs } from '@/utils';
import './styles/list.less';
import services from '@/services';
import { pathToRegexp } from 'path-to-regexp'
import { useEffect } from 'react'
import customerCfg from '@/config/customer'
import { rest } from 'lodash';

const explain = new Explain(customerCfg)

export default function ({ location }) {
  const formatMessage = useIntl().formatMessage;

  let { pathname, query } = history.location;

  // 取URL参数
  let pathType = pathToRegexp('/:module/customer/:type').exec(pathname)

  const module = pathType && pathType[1]

  let type = pathType && pathType[2]
 

  // 根据地址不同分配不同的columns和filter
  const pageCfg = {
    list: module === 'pre-sales' ? 'pre_customer' : 'after_customer',
    unassigned: 'unassigned',
    assigned: 'assigned'
  }
  const { language } = useModel('common')
  // 配置列
  const { columns, filter } = explain.setRuleKey(pageCfg[type]).setFormatMessage(formatMessage).generate({ language })

  // 使用model
  const { initialState, setInitialState } = useModel('@@initialState');
  // 根据地址不同调取不同的接口
  const fetchMap = {
    list: module === 'after-sales' ? services.after.customerList : services.pre.customerList,
    unassigned: services.after.customerNotDistributed,
    assigned: services.after.customerDistributed,
  }

  // 获取列表数据
  let { data, loading, run: runCustomerList } = useRequest(fetchMap[type], {
    manual: true,
    onSuccess({ meta }) {
      const assets = initialState?.assets ?? {}
      setInitialState({ ...initialState, assets: { ...assets, ...meta.number_stats } })
    }
  });

  // 转移未分配订单
  const { run: runTransferCustomer } = useRequest( services.after[module === 'after-sales' ? 'customerStepDistribute' : 'customerTransferTo'], {
    manual: true,
    onSuccess() {
      runCustomerList().then()
      message.success(formatMessage({ id: 'app.message.distributeSuccess' }), 2)
    }
  });

  useEffect(() => {
    const params = {
      ...query,
      received_flag: getActiveKey(),
    };

    runCustomerList(params).then()
  }, [query]);

  const handlerTabsChange = activeKey => { 
    let transQuery = { ...query, page: 1, current: 1, received_flag: activeKey };
    history.push(location.pathname + '?' + qs.stringify(transQuery, { arrayFormat: 'indices', encode: false }));
  };

  const handlerSubmit = values => {
    let transQuery = { ...values, received_flag: getActiveKey() };
    history.push(location.pathname + '?' + qs.stringify(transQuery, { arrayFormat: 'indices', encode: false }));
  };

  const handlerPageChange = (current) => {
    history.push({
      pathname,
      query: { ...query, ...current, received_flag: getActiveKey() },
    });
  };

  const getActiveKey = () => {
    const { received_flag = '1' } = query;
    return received_flag;
  };

  const handlerDistributionTo = (id, ids) => {
    if (!id) return
    runTransferCustomer({ ids, to_user_id: id }).then()
  }

  return (
    <>
      <div className="customer-filter">
        <Tabs
          activeKey={getActiveKey()}
          type="card"
          onChange={handlerTabsChange}
        >
          <Tabs.TabPane
            tab={formatMessage({ id: 'app.common.signedInCustomer' })}
            key="1"
          />
          <Tabs.TabPane
            tab={formatMessage({ id: 'app.common.notSignedInCustomer' })}
            key="0"
          />
        </Tabs>

        <Filter values={qs.parse(query)} items={filter} onSubmit={handlerSubmit} />
      </div>

      <_TransferTable
        dataSource={data?.list ?? []}
        columns={columns}
        pagination={data?.pagination ?? {}}
        onChange={handlerPageChange}
        loading={loading}
        module={module}
        {
        ...type === 'unassigned'
          ? {
            mode: "customer",
            onDistributionTo: handlerDistributionTo,
            transferDesc: {
              desc: formatMessage({ id: 'app.common.distributCustomTo' })
            }
          }
          : null
        }
      />
    </>
  );
}
