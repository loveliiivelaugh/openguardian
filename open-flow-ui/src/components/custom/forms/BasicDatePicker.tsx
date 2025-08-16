import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import moment from 'moment';

export function BasicDatePicker(props: any) {
  return (
    <DatePicker label={props.label} value={moment(props.value)} onChange={props.handleChange} />
  );
}

export const BasicTimePicker = (props: any) => {
  return (
    <TimePicker 
      label={props.label} 
      value={moment(props.value, "h:mm a")} 
      onChange={props.handleChange}
      disabled={props.disabled}
    />
  );
}