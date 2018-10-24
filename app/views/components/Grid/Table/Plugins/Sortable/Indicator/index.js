import styled from "styled-components"
import React from 'react'

import ArrowDownIcon from '../../../../../SvgIcons/ArrowDropDown/IconArrowDropDown'

const Icon = styled(ArrowDownIcon)`
  position: relative;
  margin-left: 0.25em;
  transform: rotate(${props => (props.isAscending ? '0deg' : '180deg')});
`

const SortIndicator = ({ column, sortBy, isAscending }) => {
  if (!sortBy || sortBy.id !== column.id) {
    return false
  }

  return <Icon isAscending={isAscending} />
}

export default SortIndicator
