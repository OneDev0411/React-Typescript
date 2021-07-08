import { weekDayOptions } from 'components/WeekdaySelect/constants'

import FormSelect, { FormSelectProps } from '../FormSelect'

type FormWeekdaySelectProps = Omit<FormSelectProps<Weekday>, 'options'>

function FormWeekdaySelect(props: FormWeekdaySelectProps) {
  return <FormSelect<Weekday> {...props} options={weekDayOptions} />
}

export default FormWeekdaySelect
