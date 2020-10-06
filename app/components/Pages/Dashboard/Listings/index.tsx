import React, { ReactElement, ReactChildren, cloneElement } from 'react'

import { Box } from '@material-ui/core'
import { useTitle } from 'react-use'

import { ShareAction } from 'components/ShareAction'

import { ShareListings } from './components/ShareListings'

interface Props {
  children: ReactElement<ReactChildren>
}
function Listings({ children, ...rest }: Props) {
  useTitle('Properties | Rechat')

  return (
    <ShareAction>
      <Box px={5}>{cloneElement(children, rest)}</Box>
      <ShareListings />
    </ShareAction>
  )
}

export default Listings
