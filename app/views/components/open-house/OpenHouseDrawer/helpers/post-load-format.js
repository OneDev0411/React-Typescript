import { addressTitle } from 'utils/listing'
import { getReminderItem } from 'views/utils/reminder'
import { REMINDER_DROPDOWN_OPTIONS } from 'views/utils/reminder'
import {
  normalizeListing,
  normalizeAssociations
} from 'views/utils/association-normalizers'

/**
 * Format form data for api model
 * @param {object} task The Task entity
 * @param {object} owner logged in user
 * @param {object} listing The open house listing
 * @returns {Promise} a formated Task
 */
export async function postLoadFormat(task, owner, listing) {
  let reminder = REMINDER_DROPDOWN_OPTIONS[5] // One hour before

  let location = {
    association_type: 'listing',
    index: 1,
    listing: normalizeListing(listing)
  }

  let registrants = []

  if (!task) {
    return {
      assignees: [owner],
      registrants,
      endDate: null,
      dueDate: new Date(),
      location,
      reminder,
      title: (listing && addressTitle(listing.property.address)) || ''
    }
  }

  const { reminders, end_date } = task
  const normalizeServerDate = date => date * 1000
  const dueDate = normalizeServerDate(task.due_date)
  const endDate = end_date ? new Date(normalizeServerDate(end_date)) : null

  if (Array.isArray(reminders) && reminders.length > 0) {
    const { timestamp } = reminders[reminders.length - 1]

    if (timestamp) {
      reminder = getReminderItem(dueDate, timestamp * 1000)
    }
  }

  if (task.assignees == null) {
    task.assignees = []
  }

  let allAssociations = []

  if (Array.isArray(task.associations)) {
    allAssociations = normalizeAssociations(task.associations)
  }

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
    endDate,
    dueDate: new Date(dueDate),
    location,
    registrants,
    reminder
  }
}
