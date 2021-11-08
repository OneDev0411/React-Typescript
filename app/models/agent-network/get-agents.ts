import Fetch from '@app/services/fetch'

export interface AgentWithStats extends IAgent {
  stats: {
    selling: number
    listing: number
    volume_in: number
    avg_price: number
  }
}

export default async function getAgents(
  filters: AlertFiltersWithRadiusAndCenter
): Promise<AgentWithStats[]> {
  const response = await new Fetch({ proxy: false })
    .post('/listings/filter/agents')
    .query({ associations: ['agent.office'] })
    .send(filters)

  return response.body.data
}
