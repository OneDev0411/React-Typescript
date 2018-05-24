import React from 'react'
import cn from 'classnames'
import ToolTip from '../tooltip'
import Checkmark from '../../../components/Pages/Dashboard/Partials/Svgs/Checkmark'

export default ({
  square = false,
  selected,
  title,
  tooltip = null,
  disabled = false,
  className,
  onClick = () => null
}) => (
  <div
    className={cn('deal-radio', { [className]: className, selected })}
    onClick={onClick}
  >
    <ToolTip caption={tooltip}>
      <div className="inline">
        <span className={cn('radio-button', { selected, square, disabled })}>
          <Checkmark color={selected ? '#fff' : 'transparent'} />
        </span>

        <span
          className={cn('radio-label', { disabled })}
          data-test="radio-label"
        >
          {title}
        </span>
      </div>
    </ToolTip>
  </div>
)
