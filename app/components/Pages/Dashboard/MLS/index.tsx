import { ReactElement, ReactChildren, cloneElement } from 'react'

import { useTitle } from 'react-use'

import { ListSelection } from '@app/views/components/ListSelection'

interface Props {
  children: ReactElement<ReactChildren>
}

function Listings({ children, ...rest }: Props) {
  useTitle('Properties | Rechat')

  return (
    <ListSelection<ICompactListing>>
      <>{cloneElement(children, rest)}</>
    </ListSelection>
  )
}

export default Listings
