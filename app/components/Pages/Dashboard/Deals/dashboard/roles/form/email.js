import React from 'react'
import cn from 'classnames'

export default ({ form, required, isInvalid, onChange }) => (
  <div className="input-container email">
    <label htmlFor="email" style={{ display: 'block', cursor: 'pointer' }}>
      Email {required && <sup>*</sup>}
    </label>
    <input
      id="email"
      name="email"
      type="email"
      required="required"
      placeholder="johnsmith@gmail.com"
      className={cn({ invalid: isInvalid })}
      value={form.email || ''}
      onChange={e => onChange(e.target.value)}
    />

    {isInvalid && <span className="error">Enter a valid email</span>}
  </div>
)
