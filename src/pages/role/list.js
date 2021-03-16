import { history, useRequest, useIntl, useLocation, Link } from 'umi';
import { Button, Popconfirm } from 'antd';
import { DataSheet, Dialog } from '@/components';

import services from '@/services';

export default function({ location }) {
  const { formatMessage } = useIntl(); // 语言包国际化方案函数
  // 角色列表请求
  const { data, loading } = useRequest(services.roleList, {
    manual: false,
    refreshDeps: [location.key],
  });
  const { run: runDelete } = useRequest(services.roleDelete, {
    manual: true,
    onSuccess: () => history.push(location),
  });
  // 表格配置
  const columns = [
    {
      title: formatMessage({ id: 'app.common.roleName' }),
      dataIndex: 'name',
      align: 'center',
      width: 200,
    },
    {
      title: formatMessage({ id: 'app.common.remark' }),
      dataIndex: 'remark',
      render: v => v || '-',
    },
    {
      width: 200,
      align: 'center',
      title: formatMessage({ id: 'app.global.action' }),
      render: d => (
        <>
          <Link to={`/system/role/${d.id}`}>
            {formatMessage({ id: 'app.global.modify' })}
          </Link>
          <Button type="link" onClick={() => onDeleteClick(d)}>
            {formatMessage({ id: 'app.global.delete' })}
          </Button>
        </>
      ),
    },
  ];
  const extra = [
    {
      title: formatMessage({ id: 'app.global.add' }),
      type: 'primary',
      to: '/system/role/creation',
    },
  ];
  function onDeleteClick(item) {
    Dialog.confirm({
      message: item.relate_valid_user > 0
      ? formatMessage({ id: 'app.message.roleDeleteWarn' })
      : formatMessage({ id: 'app.message.roleDeleteInfo' }),
      onOk: () => runDelete({ id: item.id })
    })
  }
  return (
    <>
      <DataSheet
        extra={extra}
        dataSource={data?.list}
        columns={columns}
        loading={loading}
      />
    </>
  );
}
