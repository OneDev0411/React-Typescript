import React from 'react'

import { withRouter, WithRouterProps } from 'react-router'
import { useTitle } from 'react-use'

import { ListingDetails } from '../../../../../views/components/ListingDetails'

interface Props {
  id: UUID
}

const Listing: React.FC<Props & WithRouterProps> = props => {
  useTitle('Listing | Rechat')

  return <ListingDetails id={props.id || props.params.id} />
}

export default withRouter(Listing)
