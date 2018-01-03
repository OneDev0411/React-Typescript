import React from 'react'

export default ({
  form,
  validation,
  onChange
}) => {
  // company field can be hidden for the following role types: Buyer, Seller, Landlord, Tenant
  if (!form.role || ['Buyer', 'Seller', 'Landlord', 'Tenant'].indexOf(form.role) > -1) {
    return false
  }

  return (
    <div className="last_name">
      <label>Company</label>

      <input
        id="company"
        name="company"
        type="text"
        placeholder="Company Name"
        value={form.company_title || ''}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

