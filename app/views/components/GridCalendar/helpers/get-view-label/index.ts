import { ViewType } from '../../types'

export default function getViewName(viewType: Optional<ViewType>) {
  switch (viewType) {
    case 'dayGridMonth':
      return 'Month'
    case 'timeGridDay':
      return 'Day'
    case 'timeGridWeek':
      return 'Week'
    default:
      return 'Change View'
  }
}
