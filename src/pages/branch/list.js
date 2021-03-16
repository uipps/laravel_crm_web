import { useEffect } from 'react'
import { Link, useRequest, useIntl, history } from 'umi'
import { Button, Popconfirm } from 'antd'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import services from '@/services'
import { DataSheet, Dialog } from '@/components'
import { basic } from '@/utils'
import styles from './styles/list.less'

export default function ({
  location
}) {
  const { formatMessage } = useIntl() // 国际化语言方案
  const { data, loading, run: runList } = useRequest(services.branchList, {
    manual: true,
    refreshDeps: [location.key],
  })
  useEffect(() => {
    runList({ ...location.query })
  }, [location])
  const { run: runDelete } = useRequest(services.branchDelete, {
    manual: true,
    onSuccess: () => history.push({
      ...location
    }),
  });
  function onDeleteClick(item) {
    Dialog.confirm({
      message: formatMessage({ id: item.user_num_all_level > 0 ?
         'app.message.branchDeleteWarn': 'app.message.branchDeleteInfo' 
      }),
      onOk: () => runDelete({ id: item.id })
    })
  }
  const columns = [
    {
      title: formatMessage({ id: 'app.common.branchName'}),
      dataIndex: 'name',
      width: 260,
      className: styles.branchName
    },
    {
      title: formatMessage({ id: 'app.common.jobType' }),
      dataIndex: 'job_type',
      width: 120,
      align: 'center',
      render: v => basic.formatDDIC(`sys_department.job_type.${v}`)
    },
    {
      title: formatMessage({ id: 'app.common.branchStatus' }),
      dataIndex: 'status',
      width: 160,
      align: 'center',
      render: v => <span className={!!v ? 'text-primary' : ''}>{basic.formatDDIC(`sys_department.status.${v}`)}</span>
    },
    {
      title: formatMessage({ id: 'app.common.country' }),
      dataIndex: 'country_weight_ratio',
      render: items => Array.isArray(items) && items.map(d => d.country_name).join(',')
    },
    {
      title: formatMessage({ id: 'app.common.remark' }),
      dataIndex: 'remark'
    },
    {
      width: 200,
      align: 'center',
      title: formatMessage({ id: 'app.global.action' }),
      render: (d) => (
        <>
         <Link to={`/system/branch/${d.id}`}>
           { formatMessage({ id: 'app.global.modify' })}
         </Link>
         <Button
          type="link"
          onClick={() => {
            onDeleteClick(d)
          }}
        >
            { formatMessage({ id: 'app.global.delete' })}
          </Button>
{/*          <Popconfirm
            title={formatMessage({ id: 'app.common.confirm.deleteInfo' })}
            okText={formatMessage({ id: 'app.global.ok' })}
            cancelText={formatMessage({ id: 'app.global.cancel' })}
            onConfirm={() => runDelete({ id: d.id })}
          >
            <Button type="link">
              { formatMessage({ id: 'app.global.delete' })}
            </Button>
          </Popconfirm> */}
        </>
      )
    }
  ]
  const extra = [
    {
      title: formatMessage({id: 'app.global.add'}),
      type: 'primary',
      to: '/system/branch/creation'
    }
  ]
  const onTableChange = (query) => {
    history.push({
      pathname: location.pathname,
      query: { ...location.query, ...query }
    })
  }
  return (
    <>
      <DataSheet
        loading={loading}
        columns={columns}
        extra={extra}
        onChange={onTableChange}
        dataSource={data?.list}
        pagination={data?.pagination}
        expandable={{
          indentSize: 20,
          expandedRowKeys: basic.expandedKeysTree(data?.list, 'id'),
          expandIcon: ({ expanded, onExpand, record }) => {
            return record.children && record.children.length ? (
              expanded ? <CaretDownOutlined onClick={e => onExpand(record, e)} /> :
              <CaretUpOutlined onClick={e => onExpand(record, e)} />
            ) : null
          }
        }}
      />
    </>
  )
}
