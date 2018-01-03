import React from 'react'
import cn from 'classnames'

export default ({
  form,
  validation,
  onChange
}) => (
  <div className="input-container">
    <div className="email">
      <input
        id="email"
        required="required"
        className={cn({ invalid: validation.email === 'error' })}
        value={form.email || ''}
        onChange={e => onChange(e.target.value)}
      />
      <label htmlFor="email">Email</label>
    </div>
    {validation.email === 'error' && <span>Enter a valid email</span>}
  </div>
)

