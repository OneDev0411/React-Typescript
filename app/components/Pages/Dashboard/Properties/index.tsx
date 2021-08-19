import { ReactElement, ReactChildren, cloneElement } from 'react'

import { useTitle } from 'react-use'

import { ListSelection } from 'components/ListSelection'

interface Props {
  children: ReactElement<ReactChildren>
}

function Listings({ children, ...rest }: Props) {
  useTitle('Properties v.2 | Rechat')

  return (
    <ListSelection<IListing>>
      <>{cloneElement(children, rest)}</>
    </ListSelection>
  )
}

export default Listings
