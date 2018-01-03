import React from 'react'
import cn from 'classnames'

export default ({
  form,
  validation,
  onChange
}) => (
  <div className="input-container phone">
    <label>Phone</label>

    <input
      name="phone"
      type="text"
      placeholder="(###) - ### ####"
      value={form.phone || ''}
      onChange={e => onChange(e.target.value)}
    />

    {validation.phone === 'error' && <span className="error">Enter a valid phone</span>}
  </div>
)

