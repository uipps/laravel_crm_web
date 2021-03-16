import { useEffect } from 'react';
import { history, useRequest, useIntl } from 'umi'
import { Row, Col, Card, Statistic, Button, Radio, DatePicker } from 'antd';
import { StatisticBox, DataSheet } from '@/components'
import { moment, numeral } from '@/utils'
import services from '@/services'
import style from './style.less'
export default function ({
  location
}) {
  const { run, data, loading } = useRequest(services.afterDashboard, { manual: true }) // 创建action
  const { formatMessage } = useIntl();

  useEffect(() => {
    run(location.query)
  }, [location.query])

  const { customer = {}, order = [] } = data || {}
  const tableColumns = [
    { title: ' ', dataIndex: ['country', 'display_name'] },
    { title: formatMessage({ id: 'app.common.underOrderNum' }), align: 'center', dataIndex: 'order_total_num' },
    { title: formatMessage({ id: 'app.common.signForRatio' }), align: 'center', dataIndex: 'received_rate', render: v => numeral(v).format('0.00%') },
    { title: formatMessage({ id: 'app.common.hasSignFor' }), align: 'center', dataIndex: 'order_received_num' },
    { title: formatMessage({ id: 'app.common.rejectSignFor' }), align: 'center', dataIndex: 'order_refused_num' },
    { title: formatMessage({ id: 'app.common.notSignFor' }), align: 'center', dataIndex: 'order_unreceived_num' },
    { title: formatMessage({ id: 'app.common.signOrderAmount' }), align: 'center', dataIndex: 'order_received_money' },
  ]
  const onChange = (mt = []) => {
    if (mt) {
      let [start_time, end_time] = mt.map((m, idx) => idx === 0 ? m.startOf('d').unix() : m.endOf('d').unix())
      history.push(`/after-sales/dashboard?start_time=${start_time}&end_time=${end_time}`)
    } else {
      history.push('/after-sales/dashboard')
    }

  }

  return (
    <>
      <Card>
        <Row justify="space-around">
          <Col flex={1} >
            <Statistic title={formatMessage({id: 'app.common.distributCustom'})} value={customer.customer_all || '0'} className={style.center} />
          </Col>
          <Col flex={1}>
            <Statistic title={formatMessage({id: 'app.common.customQuality'}, {quality: 'A'})} value={customer.customer_level_a || '0'} className={style.center} />
          </Col>
          <Col flex={1}>
            <Statistic title={formatMessage({id: 'app.common.customQuality'}, {quality: 'B'})} value={customer.customer_level_b || '0'} className={style.center} />
          </Col>
          <Col flex={1}>
            <Statistic title={formatMessage({id: 'app.common.customQuality'}, {quality: 'C'})} value={customer.customer_level_c || '0'} className={style.center} />
          </Col>
          <Col flex={1}>
            <Statistic title={formatMessage({id: 'app.common.customQuality'}, {quality: 'D'})} value={customer.customer_level_d || '0'} className={style.center} />
          </Col>
        </Row>
      </Card>

      <DataSheet
        extra={<DatePicker.RangePicker onChange={onChange} />}
        headerStyle={{ textAlign: 'right' }}
        style={{ marginTop: 16 }}
        rowKey="country_id"
        columns={tableColumns}
        dataSource={order}
      />
    </>
  );
}
