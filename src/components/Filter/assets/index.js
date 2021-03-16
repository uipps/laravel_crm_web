import Input from './Input';
import Select from './Select';
import DatePicker from './DatePicker';
import selectAndInput from './selectAndInput'

export default {
  input: {
    Component: Input,
    format: [],
  },
  select: {
    Component: Select,
    format: [],
  },
  datePicker: {
    Component: DatePicker,
  },
  selectAndInput: {
    Component: selectAndInput
  }
};
