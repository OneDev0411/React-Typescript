import React from 'react'
import Editable from '../Editable'

function Field({ field, isSaving, onChange, onDelete }) {
  if (!field.attribute_def) {
    return null
  }

  return (
    <li className="c-contact-details-item">
      <label className="c-contact-details-item__label">
        {field.attribute_def.label}
      </label>
      <span className="c-contact-details-item__field">
        <Editable
          showEdit
          field={field}
          placeholder="-"
          disabled={isSaving}
          onChange={onChange}
          onDelete={onDelete}
        />
      </span>
    </li>
  )
}

export default Field
