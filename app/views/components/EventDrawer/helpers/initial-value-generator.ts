import { EditorState } from 'draft-js'
import { stateFromHTML } from 'draft-js-import-html'

import { REMINDER_DROPDOWN_OPTIONS } from 'views/utils/reminder'

/**
 * return the multiple five of input
 * @param {number} owner The owner of event
 * @returns {numver} a rounded number
 */
const roundToMultipleFive = n => {
  if (n % 5 == 0) {
    return n
  }

  return Math.floor(n / 5) * 5 + 5
}

/**
 * Generate a initial value for event drawer
 * @param {IUser} owner The owner of event
 * @param {Array<ICRMTask>} associations initial associations
 * @param {Date} dueDate initial start date
 * @param {Date} endDate initial end date
 * @returns {object} a formated Task
 */
export const initialValueGenerator = (
  owner: IUser,
  associations: Array<ICRMTask> = [],
  dueDate: Date = new Date(),
  endDate?: Date
) => {
  const reminder = REMINDER_DROPDOWN_OPTIONS[3] // 15 minutes before
  const description = EditorState.createWithContent(stateFromHTML(''))

  dueDate.setHours(
    dueDate.getHours(),
    roundToMultipleFive(dueDate.getMinutes()),
    0,
    0
  )

  // 1 hour after
  const baseEndDate = new Date(dueDate.getTime() + 3600000)

  return {
    assignees: [owner],
    associations,
    description,
    dueDate,
    endDate: endDate || baseEndDate,
    all_day: false,
    allDay: false,
    reminder,
    task_type: { title: 'Call', value: 'Call' }
  }
}
