import Fetch from '../../../services/fetch'

export interface UpgradeAgentParams {
  agent: UUID
  secret: string
}

/**
 * Upgrade user to agent wirh its agent_id and secret question answer
 */
export async function upgradeAgent(
  params: UpgradeAgentParams
): Promise<IUser | undefined> {
  try {
    const response = await new Fetch().patch('/users/self/upgrade').send(params)

    return response.body.data
  } catch (error) {
    throw error
  }
}

export default upgradeAgent
