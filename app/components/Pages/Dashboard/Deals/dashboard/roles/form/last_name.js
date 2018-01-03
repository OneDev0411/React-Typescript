import React from 'react'

export default ({
  form,
  onChange
}) => (
  <div className="last_name">
    <input
      id="last_name"
      required="required"
      value={form.legal_last_name || ''}
      onChange={e => onChange(e.target.value)}
    />
    <label htmlFor="last_name">Legal Last Name</label>
  </div>
)

