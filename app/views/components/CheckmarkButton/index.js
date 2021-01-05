import React from 'react'
import cn from 'classnames'

import { Tooltip } from '@material-ui/core'

import Checkmark from '../../../components/Pages/Dashboard/Partials/Svgs/Checkmark'

export default ({
  square = false,
  selected,
  title,
  tooltip = '',
  disabled = false,
  className,
  onClick = () => null,
  style = {}
}) => (
  <div
    className={cn('deal-radio', { [className]: className, selected })}
    style={style}
    onClick={onClick}
  >
    <Tooltip title={tooltip}>
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
    </Tooltip>
  </div>
)
