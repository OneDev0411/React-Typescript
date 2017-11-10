import React from 'react'
import cn from 'classnames'

export default ({
  selected,
  title,
  onClick = () => null
}) => (
  <div
    className="deal-radio"
    onClick={onClick}
  >
    <span
      className={cn('radio-button', { selected })}
    >
      <i className={cn('fa fa-check', { selected })} />
    </span>

    <span className="radio-label">
      { title }
    </span>
  </div>
)
