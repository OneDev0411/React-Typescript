import Fetch from '../../../../services/fetch'

/**
 * Delete a Context
 */

export default async function deleteContext(
  brand: Nullable<UUID>,
  contextId: UUID
): Promise<boolean> {
  try {
    if (!brand) {
      throw new Error('Can not delete context. brand is not provided')
    }

    const response = await new Fetch().delete(
      `/brands/${brand}/contexts/${contextId}`
    )
    const res: number = response.status

    return res === 204
  } catch (error) {
    throw error
  }
}
