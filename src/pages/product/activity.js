import { DataSheet, Filter, IconFont } from '@/components'
import { useIntl, Link, useRequest, history } from 'umi'
import { message, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';

import services from '@/services';
import { basic } from '@/utils'

export default function() {
  const formatMessage = useIntl().formatMessage

  const filterItems = [
    {
      label: formatMessage({id: 'app.common.activityName'}),
      type: 'input',
      id: 'name',
    },
    {
      label: formatMessage({id: 'app.common.goodsName'}),
      type: 'input',
      id: 'internal_name',
    },
  ]

  const columns = [
    {
      title: formatMessage({id: 'app.common.activityName'}),
      dataIndex: 'name',
      render(text, record) {
        return <a onClick={() => {onEditActivity(record.id)}}>{text}</a>
      }
    },
    {
      title: formatMessage({id: 'app.common.activityType'}),
      dataIndex: 'type',
      render: text => basic.formatDDIC(`promotion.type.${text}`, '-'),
    },
    {
      title: formatMessage({id: 'app.common.activitySuperposition'}),
      dataIndex: 'rule_attr',
      render: text => basic.formatDDIC(`promotion.rule_attr.${text}`, '-'),
    },
    {
      title: formatMessage({id: 'app.common.ruleScope'}),
      dataIndex: 'rule_scope',
      align: 'center',
      render: text => basic.formatDDIC(`promotion.rule_scope.${text}`, '-'),
    },
    {
      title: formatMessage({id: 'app.common.goodsScope'}),
      dataIndex: 'goods_scope',
      align: 'center',
      render: text => basic.formatDDIC(`promotion.goods_scope.${text}`, '-'),
    },
    {
      title: formatMessage({id: 'app.global.state'}),
      dataIndex: 'status',
      align: 'center',
      render(text) {
        return <span style={{color: String(text) === '1' ? '#61B51C' : ''}}>{basic.formatDDIC(`promotion.status.${text}`, '-')}</span>
      }
    },
    {
      title: formatMessage({id: 'app.global.action'}),
      dataIndex: 'n',
      align: 'center',
      render(text, record) {
        return (
          <>
            <a style={{marginRight: 16}} onClick={() => { onEditActivity(record.id) }}>{formatMessage({id: 'app.global.modify'})}</a>
            <a onClick={() => { onDelActivity(record) }}>{formatMessage({id: 'app.global.delete'})}</a>
          </>
        )
      }
    },
  ]

  const { pathname, query } = history.location

  // 请求活动列表
  const { data: data, run: runActivityList, loading } = useRequest(() => {
    return services.activityList(query, {})
  }, {
    refreshDeps: [query],
  })

  // 请求删除活动
  const { run: runActivityDel } = useRequest(services.activityDel, {
    manual: true,
    onSuccess() {
      runActivityList().then()

      message.success(formatMessage({id: 'app.message.delete.success'}), 2)
    }
  })

  const handlerFilterSubmit = (values) => {
    history.push({
      pathname,
      query: values
    })
  }

  const handlerPageChange = (current) => {
    history.push({
      pathname,
      query: { ...query, ...current }
    })
  }

  const onDelActivity = ({id, status}) => {
    if(status === 1) {
      Modal.warning({
        content: formatMessage({id: 'app.common.activityDeleteWarn'}),
      })
    }
    if(status === 0) {
      Modal.confirm({
        content: formatMessage({id: 'app.common.activityDeleteConfirm'}),
        icon: <ExclamationCircleOutlined />,
        onOk() {
          runActivityDel({id}).then()
        },
        okText: formatMessage({id: 'app.global.ok'}),
        cancelText: formatMessage({id: 'app.global.cancel'}),
      })
    }
  }

  const onEditActivity = (id) => {
    history.push(`/after-sales/product/activity/${id}`)
  }

  return(
    <>
      <Filter
        items={filterItems}
        onSubmit={handlerFilterSubmit}
        values={query}
        style={{marginBottom: 16}}
      />

      <DataSheet
        dataSource={data?.list ?? []}
        columns={columns}
        pagination={data?.pagination ?? {}}
        onChange={handlerPageChange}
        loading={loading}
        extra={[
          {
            title: formatMessage({id: 'app.common.activityAdd'}),
            icon: <IconFont type="icon-plus" color="fff" />,
            type: 'primary',
            onClick() {
              history.push('/after-sales/product/activity/add')
            }
          }
        ]}
      />
    </>
  )
}
