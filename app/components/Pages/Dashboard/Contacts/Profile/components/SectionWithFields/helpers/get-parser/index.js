import { parseDate } from '../../../../../../../../../utils/parse'

export function getParser({ attribute_def }) {
  if (attribute_def.data_type === 'date') {
    return date => parseDate(date)
  }

  return t => t
}
