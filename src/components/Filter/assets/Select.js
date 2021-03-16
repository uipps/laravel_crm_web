import { Select } from 'antd';

const optionsMapDefault = {
  label: 'label',
  value: 'value',
};

export default function(props) {
  let {
    options = [],
    value,
    onChange,
    optionsMap = optionsMapDefault,
    ...extend
  } = props;

  const optionsReal = options.map(e => ({
    label: e[optionsMap.label],
    value: e[optionsMap.value],
  }));

  const handleChange = value => {
    onChange && onChange(value);
  };

  return (
    <Select {...extend} value={value} onChange={handleChange}>
      {Array.isArray(optionsReal) &&
        optionsReal.map(item => (
          <Select.Option key={item.value} value={String(item.value)}>
            {item.label}
          </Select.Option>
        ))}
    </Select>
  );
}
