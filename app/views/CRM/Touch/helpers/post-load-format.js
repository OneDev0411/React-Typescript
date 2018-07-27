import fecha from 'fecha'

import { defaultTimeOption } from '../../../../utils/default-time-option'

/**
 * Format form data for api model
 * @param {object} task The Task entity
 * @param {object} defaultAssociation The default association
 * @returns {Promise} a formated Task
 */
export async function postLoadFormat(defaultAssociation) {
  const touchDate = {
    title: fecha.format(new Date(), 'MM/DD/YYYY'),
    value: new Date().getTime()
  }
  const touchTime = defaultTimeOption(null, '08:00 AM')

  const activity_type = {
    title: 'Call',
    value: 'Call'
  }
  const associations = [defaultAssociation]

  return {
    activity_type,
    touchDate,
    touchTime,
    associations
  }
}
