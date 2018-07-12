import { formatDate } from '../../../../../../../../../utils/format'

export function getFormater({ attribute_def }) {
  if (attribute_def.data_type === 'date') {
    return date => formatDate(date, 'MM/DD/YYYY')
  }

  return t => t
}
