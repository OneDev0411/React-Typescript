import React from 'react'
import styled from 'styled-components'

const Icon = styled.i`
  color: #5a7390;
  margin-left: 5px;
`

const SortIndicator = ({ column, sortBy, isAscending }) => {
  if (!sortBy || sortBy.id !== column.id) {
    return false
  }

  return <Icon className={`fa fa-caret-${isAscending ? 'down' : 'up'}`} />
}

export default SortIndicator
