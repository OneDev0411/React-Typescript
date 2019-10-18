import { getReminderItem } from 'views/utils/reminder'
import {
  normalizeListing,
  normalizeAssociations
} from 'views/utils/association-normalizers'

/**
 * Format form data for api model
 * @param {object} task The Task entity
 * @param {object} owner logged in user
 * @param {object} defaultAssociation The default association
 * @returns {Promise} a formated Task
 */
export async function postLoadFormat(task, owner, listings) {
  let clients = []
  let locations = []
  let reminder = {
    title: 'None',
    value: -1
  }

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
      endDate: null,
      locations,
      reminder,
      task_type: 'Tour'
    }
  }

  const { reminders, end_date } = task
  const normalizeServerDate = date => date * 1000
  const dueDate = normalizeServerDate(task.due_date)
  const endDate = end_date ? new Date(normalizeServerDate(end_date)) : null

  if (Array.isArray(reminders) && reminders.length > 0) {
    const { timestamp } = reminders[reminders.length - 1]

    if (timestamp && timestamp * 1000 > new Date().getTime()) {
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
          clients.push(a)
          break
        case 'listing':
          locations = [a, ...locations]
          break
        default:
          break
      }
    })
  }

  return {
    ...task,
    clients,
    dueDate: new Date(dueDate),
    endDate,
    locations: locations.sort(sortLocationsByIndex),
    reminder
  }
}

function sortLocationsByIndex(a, b) {
  if (a < b) {
    return -1
  }

  if (a > b) {
    return 1
  }

  return 0
}
