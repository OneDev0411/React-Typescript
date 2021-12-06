import { getBrandFlows } from 'models/flows/get-brand-flows'

import getFlowFilter from './get-flow-filter'

const getFlows = async activeTeamId => {
  const flows = await getBrandFlows(activeTeamId)

  return flows.map(getFlowFilter)
}

export default getFlows
