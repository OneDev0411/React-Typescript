import React from 'react'
import PropTypes from 'prop-types'

import { Tooltip } from '@material-ui/core'

import { truncateTextFromMiddle } from 'utils/truncate-text-from-middle'

export function TextMiddleTruncate(props) {
  const text = sanitizeText(props.text)

  const getTooltipCaption = () => {
    if (text.length > props.maxLength) {
      return text
    }

    return ''
  }

  return (
    <Tooltip title={getTooltipCaption()} placement={props.tooltipPlacement}>
      <span style={props.style}>
        {truncateTextFromMiddle(text, props.maxLength)}
      </span>
    </Tooltip>
  )
}

function sanitizeText(text) {
  try {
    return decodeURIComponent(text)
  } catch (e) {
    return text
  }
}

TextMiddleTruncate.propTypes = {
  text: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  tooltipPlacement: PropTypes.string,
  style: PropTypes.object
}

TextMiddleTruncate.defaultProps = {
  maxLength: 40,
  tooltipPlacement: 'top',
  style: {}
}
