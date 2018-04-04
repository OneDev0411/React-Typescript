import React from 'react'
import cn from 'classnames'
import ToolTip from '../../../components/Pages/Dashboard/Deals/components/tooltip/index'
import Checkmark from '../../../components/Pages/Dashboard/Partials/Svgs/Checkmark'

export default ({
  square = false,
  selected,
  title,
  tooltip = null,
  disabled = false,
  onClick = () => null
}) => (
  <div className="deal-radio" onClick={onClick}>
    <ToolTip caption={tooltip}>
      <div className="inline">
        <span className={cn('radio-button', { selected, square, disabled })}>
          <Checkmark color={selected ? '#fff' : 'transparent'} />
        </span>

        <span className={cn('radio-label', { disabled })} data-test="radio-label">
          {title}
        </span>
      </div>
    </ToolTip>
  </div>
)
