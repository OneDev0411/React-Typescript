import { setTime } from '../../../../utils/set-time'

/**
 * Format form data for api model
 * @param {object} values The form values
 * @returns {object} a formated object
 */
export async function preSaveFormat(values) {
  const activity_type = values.activity_type.value
  const timestamp =
    setTime(values.touchDate.value, values.touchTime.value) / 1000

  const touch = {
    activity_type,
    timestamp
  }

  if (typeof values.description === 'string' && values.description.length > 0) {
    touch.description = values.description
  }

  if (Array.isArray(values.associations) && values.associations.length > 0) {
    touch.associations = []
    values.associations.forEach(item => {
      const { association_type } = item

      if (association_type) {
        touch.associations.push({
          association_type,
          [association_type]: item[association_type].id
        })
      }
    })
  }

  return touch
}
