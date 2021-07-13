import Select, { SelectProps } from 'components/Select'

import { weekDayOptions } from './constants'

type WeekdaySelectProps = Omit<SelectProps<Weekday>, 'options'>

function WeekdaySelect(props: WeekdaySelectProps) {
  return <Select<Weekday> {...props} options={weekDayOptions} />
}

export default WeekdaySelect
