import { ReactElement, cloneElement } from 'react'

import { useTitle } from 'react-use'

import { RouteComponentProps } from '@app/routes/types'
import { withRouter } from '@app/routes/with-router'
import { ListSelection } from '@app/views/components/ListSelection'

interface Props extends RouteComponentProps {
  children: ReactElement
}

function Listings({ children, ...rest }: Props) {
  useTitle('Properties | Rechat')

  return (
    <ListSelection<ICompactListing>>
      <>{cloneElement(children, rest)}</>
    </ListSelection>
  )
}

export default withRouter(Listings)
