import { useEffect } from 'react';
import { history, useRequest, useLocation, useIntl } from 'umi';
import { Button, Radio } from 'antd';
import { StatisticBox, DataSheet } from '@/components';
import { moment } from '@/utils';
import services from '@/services';

export default function () {
  const { run, data, loading } = useRequest(services.preDashboard, { manual: true }); // 创建action
  const { query } = useLocation();
  const { formatMessage } = useIntl();

  useEffect(() => {
    let monthType = {
      1: moment().month(moment().month() - 1),
      0: moment()
    }
    let monthResult = monthType[query.month || 0]

    let params = {
      start_time: monthResult.startOf('month').unix(),
      end_time: monthResult.endOf('month').unix()
    }
    run(params)
  }, [query]);

  const { orderout_by_country: tableData = [], ...statistics } = data || {};
  const tableColumns = [
    { title: ' ', dataIndex: 'country_name' },
    { title: formatMessage({ id: 'app.common.hasSignForUpsalesOrder' }), align: 'center', render: row => `${row.orderout_signed} / ${row.order_upsales}` },
    { title: formatMessage({ id: 'app.common.notSignFor' }), align: 'center', dataIndex: 'orderout_delivering' },
    { title: formatMessage({ id: 'app.common.rejectSignFor' }), align: 'center', dataIndex: 'orderout_rejected' },
    { title: formatMessage({ id: 'app.common.signForRatio' }), align: 'center', dataIndex: 'orderout_sign_rate', render: v => `${v}%` },
  ];
  const onChange = e => {
    history.push(`/pre-sales/dashboard?month=${e.target.value}`);
  };
  return (
    <>
      <StatisticBox
        dataSource={statistics}
        columns={
          [
            {
              icon: 'icon-liebiao',
              title: formatMessage({ id: 'app.common.orderTotalCount' }),
              dataIndex: 'order_total',
            },
            {
              icon: 'icon-check-square',
              title: formatMessage({ id: 'app.common.hasResolve' }),
              dataIndex: 'order_finished',
            },
            {
              icon: 'icon-alert-o',
              title: formatMessage({ id: 'app.common.notResolve' }),
              dataIndex: 'order_unfinished',
            },
          ]
        }
      />
      <DataSheet
        extra={(
          <Radio.Group onChange={onChange} defaultValue="0" value={query.month}>
            <Radio.Button value="0">{formatMessage({ id: 'app.common.thisMonth' })}</Radio.Button>
            <Radio.Button value="1">{formatMessage({ id: 'app.common.nextMonth' })}</Radio.Button>
          </Radio.Group>
        )}
        loading={loading}
        headerStyle={{ textAlign: 'right' }}
        style={{ marginTop: 16 }}
        rowKey="country_id"
        columns={tableColumns}
        dataSource={tableData}
      />
    </>
  );
}
