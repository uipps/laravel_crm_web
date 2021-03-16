import { Row, Col } from 'antd';
export default function ({
  value,
  defaultValue = '-',
  render = v => v,
  suffix
}) {
  return (
    <Row gutter={16} align="middle">
      <Col flex="auto">
        <span>
          {render(value) || defaultValue}
        </span>
      </Col>
      {
        suffix && <Col>{suffix}</Col>
      }
    </Row>
  )
}