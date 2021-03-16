import { Row, Col, Input } from 'antd';
export default function({ size = 'middle', suffix, ...props }) {
  const { value , render = v => v} = props;
  if(value){
    props.value = render(value);
  }   
  return (
    <Input.Group size={size}>
      <Row gutter={16}>
        <Col flex="auto">
          <Input {...props} />
        </Col>
        {
          suffix && <Col>{suffix}</Col>
        }
        
      </Row>
    </Input.Group>
  );
}
