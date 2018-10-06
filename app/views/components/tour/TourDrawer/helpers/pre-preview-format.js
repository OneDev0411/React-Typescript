/**
 * Format form data for using in tour sheets preview
 * @param {object} values The form values
 * @param {object} originalValues The current tour
 * @returns {object} a formated tour object
 */
export function prePreviewFormat(values, originalValues = {}) {
  const { title, dueDate, description } = values

  const due_date = dueDate.getTime() / 1000

  const tour = {
    title,
    due_date
  }

  if ((originalValues && originalValues.id) || description) {
    tour.description = description || ''
  }

  return {
    ...originalValues,
    ...tour
  }
}
