import React from 'react'

export default ({
  form, validation, onChange, isInvalid
}) => {
  // company field can be hidden for the following role types: Buyer, Seller, Landlord, Tenant
  if (
    !form.role ||
    ['Buyer', 'Seller', 'Landlord', 'Tenant'].indexOf(form.role) > -1
  ) {
    return false
  }

  return (
    <div className="company">
      {isInvalid && (
        <span
          data-balloon-visible
          data-balloon-pos="up"
          data-balloon-length="large"
          className="c-field-balloon c-field-balloon--error"
          data-balloon="Please include only letters. You have added a number or special character."
        />
      )}

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
