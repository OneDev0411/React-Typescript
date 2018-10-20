import React from 'react'

import ArrowDownIcon from '../../../../../SvgIcons/ArrowDropDown/IconArrowDropDown'

const Icon = ArrowDownIcon.extend`
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
