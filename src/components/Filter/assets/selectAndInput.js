import { Input } from 'antd'
import BizInput from './Input'
import BizSelect from './Select'

export default function(props) {
  let {
    options = [],
    value,
    onChange,
    optionsMap,
    allowClear
  } = props;

  const [selectVal, inputVal] = value || ['', '']

  const handlerChange = (val, index) => {
    const outputValues = [selectVal, inputVal]
    outputValues[index] = val
    onChange && onChange(outputValues)
  }

  return(
    <Input.Group compact>
      <BizSelect
        style={{width: '40%'}}
        optionsMap={optionsMap}
        value={selectVal}
        options={options}
        onChange={(val) => { handlerChange(val, 0) }}
        allowClear={allowClear}
      />
      <BizInput
        style={{width: '60%'}}
        value={inputVal}
        onChange={(val) => { handlerChange(val, 1) }}
        allowClear={allowClear}
      />
    </Input.Group>
  )
}
