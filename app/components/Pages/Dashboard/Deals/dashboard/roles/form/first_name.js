import React from 'react'

export default ({
  form,
  onChange
}) => (
  <div className="first_name">
    <input
      id="first_name"
      required="required"
      value={form.legal_first_name || ''}
      onChange={e => onChange(e.target.value)}
    />
    <label htmlFor="first_name">Legal First Name</label>
  </div>
)

