import { WithRouterProps } from 'react-router'

import { AdvancedSearchTable } from './advancedSearchTable'
import { BackofficeTable } from './backofficeTable'
import { StateProps } from './types'

export default function BackofficeWraperPage(
  props: WithRouterProps & StateProps
) {
  if (props.params.filter === 'advanced') {
    return <AdvancedSearchTable {...props} />
  }

  return <BackofficeTable {...props} />
}
