import Fetch from '../../../../services/fetch'

/**
 * Edit a Context
 */

export default async function editContext(
  brand: Nullable<UUID>,
  contextId: UUID | undefined,
  data: Partial<IDealBrandContext> & {
    checklists: {
      checklist: UUID
      is_required: boolean
    }[]
  }
): Promise<IDealBrandContext> {
  if (!brand) {
    throw new Error('Can not edit context. brand is not provided')
  }

  if (!contextId) {
    throw new Error('invalid context id')
  }

  const modifiedContext = {
    ...data,
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
