/**
 * Format form data for using in tour sheets preview
 * @param {object} values The form values
 * @param {object} originalValues The current tour
 * @returns {object} a formated tour object
 */
export function prePreviewFormat(values, originalValues = {}) {
  const normalizeDate = date => date.getTime() / 1000

  const tour = {
    title: values.title,
    due_date: normalizeDate(values.dueDate),
    end_date: values.endDate ? normalizeDate(values.endDate) : null
  }

  if ((originalValues && originalValues.id) || values.description) {
    tour.description = values.description || ''
  }

  return {
    ...originalValues,
    ...tour
  }
}
