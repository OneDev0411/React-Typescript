import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import ToolTip from 'components/tooltip'
import { truncateTextFromMiddle } from 'utils/truncate-text-from-middle'

export function TextMiddleTruncate(props) {
  const text = useMemo(() => decodeURIComponent(props.text), [props.text])

  const getTooltipCaption = () => {
    if (text.length > props.maxLength) {
      return text
    }

    return null
  }

  return (
    <ToolTip caption={getTooltipCaption()} placement={props.tooltipPlacement}>
      <span style={props.style}>
        {truncateTextFromMiddle(text, props.maxLength)}
      </span>
    </ToolTip>
  )
}

TextMiddleTruncate.propTypes = {
  text: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  tooltipPlacement: PropTypes.string
}

TextMiddleTruncate.defaultProps = {
  maxLength: 40,
  tooltipPlacement: 'top'
}
