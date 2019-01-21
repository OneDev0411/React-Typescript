import React from 'react'
import PropTypes from 'prop-types'

import ToolTip from 'components/tooltip'
import { truncateTextFromMiddle } from 'utils/truncate-text-from-middle'

export function TextMiddleTruncate(props) {
  const getTooltipCaption = () => {
    if (props.text.length > props.maxLength) {
      return props.text
    }

    return null
  }

  return (
    <ToolTip caption={getTooltipCaption()} placement={props.tooltipPlacement}>
      <span style={props.style}>
        {truncateTextFromMiddle(props.text, props.maxLength)}
      </span>
    </ToolTip>
  )
}

TextMiddleTruncate.propTypes = {
  text: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  tooltipPlacement: PropTypes.string
}

TextMiddleTruncate.defaultTypes = {
  maxLength: 40,
  tooltipPlacement: 'top'
}
