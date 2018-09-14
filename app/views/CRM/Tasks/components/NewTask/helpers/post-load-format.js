// import { defaultTimeOption } from '../../../../../../utils/default-time-option'

// import { getAssociations } from './get-associations'
// import { createDateOptions } from './create-date-options'

/**
 * Format form data for api model
 * @param {object} task The Task entity
 * @param {object} defaultAssociation The default association
 * @returns {Promise} a formated Task
 */
export async function postLoadFormat(task, defaultAssociation) {
  let associations = []
  let task_type = { title: 'Call', value: 'Call' }

  let dueDate = new Date()

  dueDate.setSeconds(0)
  dueDate.setMilliseconds(0)

  let reminder = {
    title: 'At the time of event',
    value: dueDate
  }

  if (defaultAssociation) {
    associations.push(defaultAssociation)
  }

  if (!task) {
    return {
      dueDate,
      reminder,
      task_type,
      associations
    }
  }

  // const { due_date, reminders, task_type: type } = task

  // if (type) {
  //   task_type = {
  //     title: type,
  //     value: type
  //   }
  // }

  // if (due_date) {
  //   dueDate = createDateOptions(today, due_date * 1000, 'due-date')
  //   dueTime = defaultTimeOption(due_date * 1000)
  // }

  // if (
  //   Array.isArray(reminders) &&
  //   reminders.length > 0 &&
  //   reminders[reminders.length - 1].timestamp
  // ) {
  //   const { timestamp } = reminders[reminders.length - 1]

  //   reminderDate = createDateOptions(
  //     due_date * 1000,
  //     timestamp * 1000,
  //     'reminder'
  //   )
  //   reminderTime = defaultTimeOption(timestamp * 1000)
  // }

  // associations = await getAssociations(task)

  // return {
  //   ...task,
  //   dueDate,
  //   dueTime,
  //   task_type,
  //   reminderDate,
  //   reminderTime,
  //   associations
  // }
}
