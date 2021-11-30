import { WithRouterProps } from 'react-router'

import { AllDealsTable } from './allDealsTable'
import { BackofficeTable } from './backofficeTable'
import { StateProps } from './types'

export default function BackofficeWraperPage(
  props: WithRouterProps & StateProps
) {
  if (props.params.filter === 'all') {
    return <AllDealsTable {...props} />
  }

  return <BackofficeTable {...props} />
}
