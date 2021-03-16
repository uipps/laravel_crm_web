import { Input } from 'antd';

export default function(props) {
  const { onChange, value, ...extend } = props;

  const handlerChange = e => {
    const { value } = e.currentTarget;
    onChange && onChange(value);
  };

  return <Input {...extend} value={value} onChange={handlerChange} />;
}
