import { DataSheet } from '@/components';
import { useRequest, useParams, useIntl, history } from 'umi';
import services from '@/services';
import { Explain } from '@/utils';
import { pathToRegexp } from 'path-to-regexp'
import orderCfg from '@/config/order'
const explain = new Explain(orderCfg)

export default function() {
  const matchParams = useParams()

  const formatMessage = useIntl().formatMessage;
  //
  // const { pathname } = history.location
  //
  // let pathType = pathToRegexp('/:module/customer/:id/order').exec(pathname)
  //
  // let module = pathType && pathType[1]

  const { columns } = explain.setRuleKey('customer_order').setFormatMessage(formatMessage).generate()

  const { data, loading, run: runQueryList } = useRequest(services.pre.customerOrderList, {
    defaultParams: [{ id: matchParams.id }]
  });

  const handlerPageChange = current => {
    runQueryList({id: matchParams.id, ...current}).then();
  };

  return (
    <DataSheet
      dataSource={data?.list ?? []}
      columns={columns}
      pagination={data?.pagination ?? {}}
      onChange={handlerPageChange}
      loading={loading}
    />
  );
}
