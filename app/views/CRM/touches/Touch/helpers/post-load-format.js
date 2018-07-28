import fecha from 'fecha'

import { getAssociations } from './get-associations'
import { defaultTimeOption } from '../../../../../utils/default-time-option'

const formatDate = date => fecha.format(date, 'MM/DD/YYYY')

/**
 * Format form data for api model
 * @param {object} touch The Touch entity
 * @param {object} defaultAssociation The default association
 * @returns {Promise} a formated Touch
 */
export async function postLoadFormat(touch, defaultAssociation) {
  let touchDate = {
    title: formatDate(new Date()),
    value: new Date().getTime()
  }
  let touchTime = defaultTimeOption(null, '08:00 AM')

  let activity_type = {
    title: 'Call',
    value: 'Call'
  }

  if (!touch) {
    return {
      activity_type,
      touchDate,
      touchTime,
      associations: [defaultAssociation]
    }
  }

  activity_type = {
    title: touch.activity_type,
    value: touch.activity_type
  }

  touchDate = {
    title: formatDate(new Date(touch.timestamp * 1000)),
    value: touch.timestamp * 1000
  }
  touchTime = defaultTimeOption(touch.timestamp * 1000)

  const associations = await getAssociations(touch)

  return {
    ...touch,
    touchDate,
    touchTime,
    activity_type,
    associations
  }
}
