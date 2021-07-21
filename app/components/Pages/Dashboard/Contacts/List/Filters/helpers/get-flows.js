import { getBrandFlows } from 'models/flows/get-brand-flows'
import { getActiveTeamId } from 'utils/user-teams'

import getFlowFilter from './get-flow-filter'

const getFlows = async user => {
  const flows = await getBrandFlows(getActiveTeamId(user, {}))

  return flows.map(getFlowFilter)
}

export default getFlows
