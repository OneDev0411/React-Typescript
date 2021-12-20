import Fetch from '../../../../services/fetch'

/**
 * export deals with filter
 */
export async function exportFilter(data: object) {
  try {
    const response = await new Fetch().post('/deals/filter.xlsx').send(data)

    return response
  } catch (e) {
    throw e
  }
}
