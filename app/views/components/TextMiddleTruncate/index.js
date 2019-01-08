import React, { Fragment } from 'react'

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
    <ToolTip caption={getTooltipCaption()}>
      <span style={props.style}>
        {truncateTextFromMiddle(props.text, props.maxLength)}
      </span>
    </ToolTip>
  )
}
