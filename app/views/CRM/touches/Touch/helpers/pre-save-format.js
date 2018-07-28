import { setTime } from '../../../../../utils/set-time'

/**
 * Format form data for api model
 * @param {object} values The form values
 * @returns {object} a formated object
 */
export async function preSaveFormat(values, originalValues) {
  const { description, associations } = values
  const activity_type = values.activity_type.value
  const timestamp =
    setTime(values.touchDate.value, values.touchTime.value) / 1000

  const touch = {
    activity_type,
    timestamp
  }

  if ((originalValues && originalValues.id) || description) {
    touch.description = description || ''
  }

  if (
    !originalValues &&
    Array.isArray(associations) &&
    associations.length > 0
  ) {
    touch.associations = []
    associations.forEach(item => {
      const { association_type } = item

      if (association_type) {
        touch.associations.push({
          association_type,
          [association_type]: item[association_type].id
        })
      }
    })
  }

  return {
    ...originalValues,
    ...touch
  }
}
