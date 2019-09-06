import React from 'react'

import Loading from 'components/LoadingContainer'

import { FallbackContainer } from './styled'
import EmptyState from './EmptyState'

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
