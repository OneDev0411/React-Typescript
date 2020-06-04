import Fetch from '../../../../services/fetch'

/**
 * Delete a Context
 */

export default async function deleteContext(
  brand: UUID,
  contextId: UUID
): Promise<boolean> {
  try {
    const response = await new Fetch().delete(
      `/brands/${brand}/contexts/${contextId}`
    )
    const res: number = response.status

    return res === 204
  } catch (error) {
    throw error
  }
}
