import React from 'react'

export default ({
  form,
  onChange
}) => (
  <div className="last_name">
    <label>Legal Last Name <sup>*</sup></label>

    <input
      id="last_name"
      name="last_name"
      type="text"
      required="required"
      placeholder="Legal Last"
      value={form.legal_last_name || ''}
      onChange={e => onChange(e.target.value)}
    />
  </div>
)

