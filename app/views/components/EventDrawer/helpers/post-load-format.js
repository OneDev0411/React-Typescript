import { EditorState } from 'draft-js'
import { stateFromHTML } from 'draft-js-import-html'

import { isNegativeTimezone } from 'utils/is-negative-timezone'

import { getReminderItem } from 'views/utils/reminder'
import { REMINDER_DROPDOWN_OPTIONS } from 'views/utils/reminder'
import { normalizeAssociations } from 'views/utils/association-normalizers'

function roundToMultipleFive(n) {
  if (n % 5 == 0) {
    return n
  }

  return Math.floor(n / 5) * 5 + 5
}

/**
 * Format form data for api model
 * @param {object} task The Task entity
 * @param {object} owner logged in user
 * @param {object} defaultAssociation The default association(s)
 * @returns {Promise} a formated Task
 */
export async function postLoadFormat(task, owner, defaultAssociation) {
  let reminder = REMINDER_DROPDOWN_OPTIONS[3] // 15 minutes before

  const associations = []

  const description = EditorState.createWithContent(
    stateFromHTML(task ? task.description : '')
  )

  if (defaultAssociation) {
    if (Array.isArray(defaultAssociation)) {
      associations.push(...defaultAssociation)
    } else {
      associations.push(defaultAssociation)
    }
  }

  if (!task) {
    const initialDueDate = new Date()

    initialDueDate.setHours(
      initialDueDate.getHours(),
      roundToMultipleFive(initialDueDate.getMinutes()),
      0,
      0
    )

    // 1 hour after
    const initialEndDate = new Date(initialDueDate.getTime() + 3600000)

    return {
      assignees: [owner],
      associations,
      description,
      dueDate: initialDueDate,
      endDate: initialEndDate,
      allDay: false,
      reminder,
      task_type: { title: 'Call', value: 'Call' }
    }
  }

  const { reminders, end_date } = task
  const isAllDayTask = task.all_day || false

  const normalizeServerDate = (date, isEndDate = false) => {
    const normalizedDate = new Date(Number(date) * 1000)

    if (isAllDayTask) {
      const resetHours = isNegativeTimezone() ? 24 : 0
      const resetMinutes = isEndDate ? -1 : 0

      normalizedDate.setHours(resetHours, resetMinutes, 0, 0)
    }

    return normalizedDate
  }
  const dueDate = normalizeServerDate(task.due_date)
  const endDate = end_date ? normalizeServerDate(end_date, true) : null

  if (Array.isArray(reminders) && reminders.length > 0) {
    const { timestamp } = reminders[reminders.length - 1]
    const rowReminder = new Date(timestamp * 1000)

    if (isAllDayTask) {
      rowReminder.setDate(rowReminder.getUTCDate())
      rowReminder.setMonth(rowReminder.getUTCMonth())
      rowReminder.setHours(
        rowReminder.getUTCHours(),
        rowReminder.getUTCMinutes(),
        0,
        0
      )
    }

    const reminderTimestamp = rowReminder.getTime()

    if (timestamp && reminderTimestamp > new Date().getTime()) {
      reminder = getReminderItem(dueDate, reminderTimestamp)
    }
  }

  if (task.assignees == null) {
    task.assignees = []
  }

  if (Array.isArray(task.associations)) {
    task.associations = normalizeAssociations(task.associations)
  } else {
    task.associations = []
  }

  return {
    ...task,
    description,
    reminder,
    dueDate,
    endDate,
    allDay: isAllDayTask,
    task_type: {
      title: task.task_type,
      value: task.task_type
    }
  }
}
