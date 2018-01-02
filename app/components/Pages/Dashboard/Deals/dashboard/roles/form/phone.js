import React from 'react'
import cn from 'classnames'

export default ({
  form,
  validation,
  onChange
}) => (
  <div className="input-container">
    <input
      className={cn('phone', { invalid: validation.phone === 'error' })}
      placeholder="Phone (xxx) xxx-xxxx"
      value={form.phone || ''}
      onChange={e => onChange(e.target.value)}
    />
    {validation.phone === 'error' && <span>Enter a valid phone</span>}
  </div>
)

