import { WithRouterProps } from 'react-router'

import { BackofficeTable } from './backofficeTable'
import { SearchPage } from './searchPage'
import { StateProps } from './types'

export default function BackofficeWraperPage(
  props: WithRouterProps & StateProps
) {
  if (props.params.filter === 'search') {
    return <SearchPage {...props} />
  }

  return <BackofficeTable {...props} />
}
