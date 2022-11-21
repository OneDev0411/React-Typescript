import React from 'react'

import { useTitle } from 'react-use'

import { RouteComponentProps } from '@app/routes/types'
import { withRouter } from '@app/routes/with-router'
import { ListingDetails } from '@app/views/components/ListingDetails'

interface Props extends RouteComponentProps<{ id: UUID }> {
  id?: UUID
}

const Listing: React.FC<Props> = props => {
  useTitle('Listing | Rechat')

  return <ListingDetails id={props.id || props.params.id} />
}

export default withRouter(Listing)
