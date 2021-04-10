import Fetch from '../../../../services/fetch'

/**
 * Edit a Context
 */

export default async function editContext(
  brand: UUID,
  contextId: UUID | undefined,
  data: IDealBrandContext
): Promise<IDealBrandContext> {
  if (!contextId) {
    throw new Error('invalid context id')
  }

  const modifiedContext: IDealBrandContext = {
    ...data,
    preffered_source: data.preffered_source ? 'MLS' : 'Provided',
    triggers_brokerwolf: false,
    order: 0
  }

  try {
    const response = await new Fetch()
      .put(`/brands/${brand}/contexts/${contextId}`)
      .send(modifiedContext)

    const context: IDealBrandContext = response.body.data

    return context
  } catch (error) {
    throw error
  }
}
