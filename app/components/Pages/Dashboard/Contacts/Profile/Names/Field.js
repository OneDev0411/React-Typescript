import React from 'react'
import Editable from '../Editable'

function Field({ field, isSaving, onChange, onDelete }) {
  const { name } = field

  const validator = name => new RegExp(/^[A-Za-z\s]+$/).exec(name)

  return (
    <li className="c-contact-details-item">
      <label className="c-contact-details-item__label">{name}</label>
      <span className="c-contact-details-item__field">
        <Editable
          showEdit
          field={field}
          placeholder="-"
          disabled={isSaving}
          onChange={onChange}
          onDelete={onDelete}
          validator={field.type === 'nickname' ? null : validator}
          validationText="Please include only letters and space. You have added a number or special character."
        />
      </span>
    </li>
  )
}

export default Field
