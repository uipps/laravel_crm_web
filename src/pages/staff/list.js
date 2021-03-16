import { useEffect } from 'react'
import { Link, useRequest, useIntl, useModel } from 'umi';
import { Button } from 'antd';
import services from '@/services';
import { DataSheet, Dialog } from '@/components';
import { basic } from '@/utils'
export default function({ location, history }) {
  const { formatMessage } = useIntl(); // 国际化语言方案

  const { data, loading, run: runList } = useRequest(services.staffList, {
    manual: true,
    refreshDeps: [location.key],
  });

  useEffect(() => {
    runList({ ...location.query })
  }, [location])

  // 获取model
  const { account } = useModel('@@initialState').initialState


  const { run: runDelete } = useRequest(services.staffDelete, {
    manual: true,
    onSuccess: () => history.push(location),
  });

  const columns = [
    {
      title: formatMessage({ id: 'app.common.staffId' }),
      dataIndex: 'id',
      align: 'center',
      width: 100,
    },
    {
      title: formatMessage({ id: 'app.common.staffName' }),
      dataIndex: 'real_name',
      width: 100,
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.staffBranch' }),
      dataIndex: 'department_name',
      width: 100,
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.staffRole' }),
      dataIndex: 'role_name',
      width: 100,
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.jobType' }),
      dataIndex: 'level',
      width: 100,
      align: 'center',
      render: v => basic.formatDDIC(`user.level_type.${v}`)
    },
    {
      title: formatMessage({ id: 'app.common.language' }),
      dataIndex: 'language_names',
      width: 100,
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.staffStatus' }),
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: v => <span className={!!v ? 'text-primary' : ''}>{basic.formatDDIC(`user.status.${v}`)}</span>
    },
    {
      width: 200,
      align: 'center',
      title: formatMessage({ id: 'app.global.action' }),
      render: (d, r) => (
        <>
          <Link to={`/system/staff/${d.id}/basic`}>
            {formatMessage({ id: 'app.global.modify' })}
          </Link>
          <Button type="link" onClick={() => onDeleteClick(d)} disabled={account.id === r.id}>
            {formatMessage({ id: 'app.global.delete' })}
          </Button>
        </>
      ),
    },
  ];
  const extra = [
    {
      title: formatMessage({id: 'app.global.add'}),
      type: 'primary',
      to: '/system/staff/creation',
    },
  ];
  const onTableChange = (query) => {
    history.push({
      pathname: location.pathname,
      query: { ...location.query, ...query }
    })
  }
  function onDeleteClick(item) {
    Dialog.confirm({
      message: item.relate_customer_num
      ? formatMessage({ id: 'app.message.staffDeleteWarn' })
      : formatMessage({ id: 'app.message.staffDeleteInfo' }),
      onOk: () => runDelete({ id: item.id })
    })
  }
  return (
    <>
      <DataSheet
        loading={loading}
        columns={columns}
        extra={extra}
        onChange={onTableChange}
        dataSource={data?.list ?? []}
        pagination={data?.pagination}
      />
    </>
  );
}
