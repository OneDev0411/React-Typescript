import { ReactElement, ReactChildren, cloneElement } from 'react'

import { useTitle } from 'react-use'

import { ListSelection } from 'components/ListSelection'

import { ShareListings } from './components/ShareListings'

interface Props {
  children: ReactElement<ReactChildren>
}

function Listings({ children, ...rest }: Props) {
  useTitle('Properties | Rechat')

  return (
    <ListSelection<IListing>>
      <>{cloneElement(children, rest)}</>
      <ShareListings />
    </ListSelection>
  )
}

export default Listings
