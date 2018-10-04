import { getAssociations } from '../../../EventDrawer/helpers/get-associations'
import { getReminderLabel } from '../../../EventDrawer/helpers/get-reminder-label'
import { normalizeListing } from '../../../../utils/association-normalizers'

/**
 * Format form data for api model
 * @param {object} task The Task entity
 * @param {object} owner logged in user
 * @param {object} defaultAssociation The default association
 * @returns {Promise} a formated Task
 */
export async function postLoadFormat(task, owner, listings) {
  const REMINDER_DEFAULT_LABEL = '15 Minutes Before'

  let reminder = {
    title: REMINDER_DEFAULT_LABEL,
    value: REMINDER_DEFAULT_LABEL
  }

  let clients = []
  let locations = []

  if (listings && listings.length > 0) {
    locations = listings.map(listing => ({
      association_type: 'listing',
      listing: normalizeListing(listing)
    }))
  }

  if (!task) {
    return {
      assignees: [owner],
      clients,
      dueDate: new Date(),
      locations,
      reminder,
      task_type: 'tour'
    }
  }

  const { reminders, due_date } = task
  const dueDate = due_date * 1000

  if (
    Array.isArray(reminders) &&
    reminders.length > 0 &&
    reminders[reminders.length - 1].timestamp
  ) {
    const { timestamp } = reminders[reminders.length - 1]

    const title = getReminderLabel(dueDate, timestamp * 1000)

    reminder = { title, value: title }
  }

  if (
    Array.isArray(reminders) &&
    reminders.length > 0 &&
    reminders[reminders.length - 1].timestamp
  ) {
    const { timestamp } = reminders[reminders.length - 1]

    const title = getReminderLabel(dueDate, timestamp * 1000)

    reminder = { title, value: title }
  }

  if (task.assignees == null) {
    task.assignees = []
  }

  const allAssociations = await getAssociations(task)

  if (allAssociations.length > 0) {
    allAssociations.forEach(a => {
      switch (a.association_type) {
        case 'contact':
          clients.push(a)
          break
        case 'listing':
          locations.push(a)
          break
        default:
          break
      }
    })
  }

  return {
    ...task,
    reminder,
    clients,
    locations,
    dueDate: new Date(dueDate)
  }
}
