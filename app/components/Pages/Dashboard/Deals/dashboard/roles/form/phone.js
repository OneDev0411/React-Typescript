import React from 'react'
import cn from 'classnames'

export default ({ form, onChange, isInvalid }) => (
  <div className="input-container phone">
    <label htmlFor="phone" style={{ display: 'block', cursor: 'pointer' }}>
      Phone
    </label>

    <input
      id="phone"
      name="phone"
      type="text"
      placeholder="(###) - ### ####"
      value={form.phone || ''}
      onChange={e => onChange(e.target.value)}
    />

    {isInvalid && <span className="error">Enter a valid phone</span>}
  </div>
)
