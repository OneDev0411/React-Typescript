import React from 'react'
import { useTitle } from 'react-use'
import { withRouter, WithRouterProps } from 'react-router'

import { ListingDetails } from '../../../../../views/components/ListingDetails'

const Listing: React.FC<WithRouterProps> = props => {
  useTitle('Listing | Rechat')

  return <ListingDetails id={props.params.id} />
}

export default withRouter(Listing)
