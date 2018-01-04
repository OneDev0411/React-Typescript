import React from 'react'
import cn from 'classnames'

export default ({
  form,
  validation,
  onChange
}) => (
  <div className="input-container email">
    <label>Email <sup>*</sup></label>
    <input
      name="email"
      type="email"
      required="required"
      placeholder="johnsmith@gmail.com"
      className={cn({ invalid: validation.email === 'error' })}
      value={form.email || ''}
      onChange={e => onChange(e.target.value)}
    />

    {validation.email === 'error' && <span className="error">Enter a valid email</span>}
  </div>
)
