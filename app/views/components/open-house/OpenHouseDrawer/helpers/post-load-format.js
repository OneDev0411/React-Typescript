import { getAssociations } from '../../../EventDrawer/helpers/get-associations'
import { getReminderLabel } from '../../../EventDrawer/helpers/get-reminder-label'
import { normalizeListing } from '../../../../utils/association-normalizers'
import { addressTitle } from '../../../../../utils/listing'

/**
 * Format form data for api model
 * @param {object} task The Task entity
 * @param {object} owner logged in user
 * @param {object} listing The open house listing
 * @returns {Promise} a formated Task
 */
export async function postLoadFormat(task, owner, listing) {
  const REMINDER_DEFAULT_LABEL = '15 Minutes Before'

  let reminder = {
    title: REMINDER_DEFAULT_LABEL,
    value: REMINDER_DEFAULT_LABEL
  }

  let location = {
    association_type: 'listing',
    listing: normalizeListing(listing)
  }

  let registrants = []

  if (!task) {
    return {
      assignees: [owner],
      registrants,
      dueDate: new Date(),
      location,
      reminder,
      task_type: 'Open House',
      title: addressTitle(listing.property.address)
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

  if (task.assignees == null) {
    task.assignees = []
  }

  const allAssociations = await getAssociations(task)

  if (allAssociations.length > 0) {
    allAssociations.forEach(a => {
      switch (a.association_type) {
        case 'contact':
          registrants.push(a)
          break
        case 'listing':
          location = a
          break
        default:
          break
      }
    })
  }

  return {
    ...task,
    dueDate: new Date(dueDate),
    location,
    registrants,
    reminder
  }
}
