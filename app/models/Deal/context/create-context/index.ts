import Fetch from '../../../../services/fetch'

/**
 * Creates a new Context
 */

export default async function createContext(
  brand: UUID,
  data: IDealBrandContext
): Promise<IDealBrandContext> {
  const newContext: IDealBrandContext = {
    ...data,
    preffered_source: data.preffered_source ? 'MLS' : 'Provided',
    triggers_brokerwolf: false,
    order: 0
  }

  try {
    const response = await new Fetch()
      .post(`/brands/${brand}/contexts`)
      .send(newContext)

    const context: IDealBrandContext = response.body.data

    return context
  } catch (error) {
    throw error
  }
}
