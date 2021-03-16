import { Row, Col, Card } from 'antd'
import { IconFont } from '../'
import { _, numeral} from '@/utils'
import './style.less'
export default function ({
  dataSource,
  emptyValue = '-',
  col = 3,
  columns = [],
  formatter = (v, f = '0,0') => numeral(v).format(f)  // 默认格式的函数
}) {
  let span = 24 / col
  return (
    <Row gutter={16}>
    {
      Array.isArray(columns) && columns.map((item, idx) => {
        let value = _.get(dataSource, item.dataIndex, emptyValue)
        value = _.isFunction(item.formatter) ? item.formatter(value) : formatter(value, item.formatter)
        return (
          <Col span={span} key={item.dataIndex || idx}>
            <Card bordered={false} >
              <div className="statistic-item">
                <span className="statistic-item__icon">
                  <IconFont type={item.icon} />
                </span>
                <div className="statistic-item__desc">
                  <span className="statistic-item--title">
                    {item.title}
                  </span>
                  <span className="statistic-item--value">
                    { value }
                  </span>
                </div>
              </div>
            </Card>
          </Col>
        )
      })
    }
    </Row>
  )
}
