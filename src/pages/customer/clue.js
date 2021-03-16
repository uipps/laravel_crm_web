import { DataSheet, Filter, _SelectService } from '@/components'
import { Explain, basic } from '@/utils'
import { useIntl, useRequest, useParams, history, useModel } from 'umi'
import { useEventEmitter } from '@umijs/hooks'
import clueCfg from '@/config/clue'
import services from '@/services';
import { useState } from 'react'
import { message } from 'antd'

const explain = new Explain(clueCfg)

const transformValues = (query, status) => {
  if (status === 'input') {
    const result = { ...query }
    const arr = query.inputMulti
    result.social_account_type = arr[0]
    result.social_account = arr[1]

    delete result.inputMulti

    return result
  }
  if (status === 'output') {
    const result = { ...query }

    result.inputMulti = [query.social_account_type, query.social_account]

    delete result.social_account_type
    delete result.social_account

    return result
  }
}

export default function (props) {
  const formatMessage = useIntl().formatMessage

  const { transferParams } = basic

  const match = useParams()

  const { pathname, query } = history.location

  const [selectedKeys, setSelectedKeys] = useState([]) // 表格选中行的IDS集合

  const [serviceNeedLangIds, setServiceNeedLangIds] = useState([]);

  const { _selectService } = useModel('modal')

  const eventEmitter = useEventEmitter(); // 创建一个事件监听器

  // 使用model
  const { initialState, setInitialState } = useModel('@@initialState');
  const { account, assets = {} } = initialState

  // 请求列表
  const { data, run: runQueryList, loading } = useRequest(() => {
    return services.clueList({ ...match, ...query })
  }, {
    formatResult: ({ data }) => {
      data.allKeys = data.list.map(item => item.id)
      return data
    },
    refreshDeps: [match, query],
    onSuccess({ meta }) {
      setInitialState({ ...initialState, assets: { ...assets, ...meta.number_stats } })
    }
  })

  const { columns, header, filter, footer } = explain.setRuleKey(match.type || 'default').setFormatMessage(formatMessage).generate(
    {
      eventEmitter,
      selectedKeys,
      allKeys: data?.allKeys ?? []
    }
  )

  eventEmitter.useSubscription(emitterKey => {
    switch (emitterKey) {
      case 'distribution':
        _selectService.setVisible(true)
        break
      case 'check-all':
        let language_ids = (data?.list || []).map(s => String(s.language_id));
        setServiceNeedLangIds(language_ids)
        setSelectedKeys(data?.allKeys ?? [])
        break
      case 'uncheck-all':
        setSelectedKeys([])
        setServiceNeedLangIds([])
        break
      default:
        break;
    }
  })

  // 请求分配
  const { run: runClueDistribute } = useRequest(services.clueDistribute, {
    manual: true,
    onSuccess() {
      runQueryList().then()
      message.success(formatMessage({ id: 'app.message.distributeSuccess' }), 2)
    }
  })

  const handlerPageChange = (page) => {
    history.push({
      pathname,
      query: { ...query, ...page }
    })
  }

  const handlerFilterSubmit = (values) => {
    history.push({
      pathname,
      query: transferParams(values).tactic({ field: 'inputMulti', to: ['social_account_type', 'social_account'] }).fetch()
    })
  }

  const handlerDistribute = ({ id, name }) => {
    const params = {
      clue_ids: selectedKeys,
      to_user_id: id
    }
    runClueDistribute(params).then()
  }

  const getValue = (query) => {
    return transferParams(query).reverse({ field: 'inputMulti', to: ['social_account_type', 'social_account'] }).fetch()
  }


  // 选中订单
  const selectedRow = (selectedRowKeys, selectedRows) => {
    let language_id = selectedRows.map(s => String(s.language_id));
    setServiceNeedLangIds(language_id)
    setSelectedKeys(selectedRowKeys)
  }

  return (
    <>
      <Filter values={getValue(query)} items={filter} onSubmit={handlerFilterSubmit} style={{ marginBottom: 16 }} />

      <DataSheet
        action={footer}
        dataSource={data?.list ?? []}
        extra={
          header
        }
        columns={columns}
        loading={loading}
        pagination={data?.pagination ?? {}}
        onChange={handlerPageChange}
        {
        ...match.type === 'distribute_not'
          ? {
            rowSelection: {
              selectedRowKeys: selectedKeys,
              type: 'checkbox',
              onChange: selectedRow
            }
          }
          : {}
        }
      />

      <_SelectService
        title={formatMessage({ id: 'app.common.assignedTo' })}
        desc={formatMessage({ id: 'app.common.clueAssignedTo' })}
        params={{ is_clue_sale: 0, job_type: 2 }}
        onSubmit={handlerDistribute}
        serviceNeedLangIds={serviceNeedLangIds}
      />
    </>
  )
}
