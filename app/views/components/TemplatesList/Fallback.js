import React from 'react'

import Loading from 'components/LoadingContainer'

import EmptyState from './EmptyState'
import { FallbackContainer } from './styled'

function Fallback(props) {
  function renderContent() {
    if (props.isLoading) {
      return <Loading style={{ padding: '5rem 0' }} />
    }

    if (props.isEmpty) {
      return props.component || <EmptyState />
    }

    return null
  }

  return <FallbackContainer>{renderContent()}</FallbackContainer>
}

export default Fallback
