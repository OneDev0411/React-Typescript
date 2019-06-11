import React from 'react'

import Loading from 'components/LoadingContainer'

import { FallbackContainer } from './styled'
import EmptyState from './EmptyState'

function Fallback(props) {
  return (
    <FallbackContainer>
      {props.isLoading && <Loading style={{ padding: '5rem 0' }} />}
      {!props.isLoading && props.isEmpty ? <EmptyState /> : null}
    </FallbackContainer>
  )
}

export default Fallback
