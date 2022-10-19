import getViewName from '../../helpers/get-view-label'
import { ViewType } from '../../types'

export const AVAILABLE_VIEWS: Record<ViewType, string> = {
  dayGridMonth: getViewName('dayGridMonth'),
  timeGridWeek: getViewName('timeGridWeek'),
  timeGridDay: getViewName('timeGridDay')
}
