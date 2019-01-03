import Fetch from '../../../../services/fetch'

import { getActiveTeamId } from '../../../../utils/user-teams'

/**
 * get contexts info
 */
export async function getContexts(user) {
  const brandId = getActiveTeamId(user)

  try {
    const response = await new Fetch().get(`/brands/${brandId}/contexts`)

    return response.body.data
  } catch (e) {
    return null
  }
}
