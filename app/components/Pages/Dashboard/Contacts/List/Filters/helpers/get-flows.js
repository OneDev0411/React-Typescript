import { getBrandFlows } from 'models/flows/get-brand-flows'

import getFlowFilter from './get-flow-filter'

const getFlows = async activeBrandId => {
  const flows = await getBrandFlows(activeBrandId)

  return flows.map(getFlowFilter)
}

export default getFlows
