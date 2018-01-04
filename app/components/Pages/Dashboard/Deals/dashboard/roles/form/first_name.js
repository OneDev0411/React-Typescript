import React from 'react'

export default ({
  form,
  onChange
}) => (
  <div className="first_name">
    <label>Legal First Name <sup>*</sup></label>
    <input
      name="first_name"
      type="text"
      required="required"
      placeholder="Legal First"
      value={form.legal_first_name || ''}
      onChange={e => onChange(e.target.value)}
    />
  </div>
)

