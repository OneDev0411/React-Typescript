import fecha from 'fecha'

export function getFormatedDueDate(
  tour: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
): string {
  const formatDate = (date, format) =>
    fecha.format(new Date(date * 1000), format)

  const dueDate = formatDate(tour.due_date, 'dddd, MMMM DD, YYYY hh:mm A')
  const endDate = tour.end_date ? formatDate(tour.end_date, ' - hh:mm A') : ''

  return dueDate + endDate
}
