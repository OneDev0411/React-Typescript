import React from 'react'
import cn from 'classnames'
import ToolTip from './tooltip'
import Checkmark from '../../Partials/Svgs/Checkmark'

export default ({
  square = false,
  selected,
  title,
  tooltip = null,
  disabled = false,
  onClick = () => null
}) => (
  <div
    className="deal-radio"
    onClick={onClick}
  >
    <ToolTip caption={tooltip}>
      <div className="inline">
        <span
          className={cn('radio-button', { selected, square, disabled })}
        >
          <Checkmark
            color={selected ? '#fff' : 'transparent'}
          />
        </span>

        <span className={cn('radio-label', { disabled })}>
          { title }
        </span>
      </div>
    </ToolTip>
  </div>
)
