import { DatePicker } from 'antd';
import moment from 'moment';

export default function(props) {
  const {
    format = 'YYYY-MM-DD',
    value,
    onChange,
    ...restProps
  } = props;

  const handlerChange = (val) => {
    val = val
      ? val.map((mt, idx) => idx === 0 ? mt.startOf('d').unix() : mt.endOf('d').unix())
      : undefined
    onChange && onChange(val);
  };

  return (
    <DatePicker.RangePicker
      {...restProps}
      value={Array.isArray(value) ? value.map(d => moment.unix(Number(d))) : [undefined, undefined]}
      onChange={handlerChange}
    />
  );
}
