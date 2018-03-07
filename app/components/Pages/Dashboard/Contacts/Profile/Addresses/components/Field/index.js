import React from 'react'
import Editable from '../../../Editable'

export default function Field({ field, ...props }) {
  return (
    <li className="c-contact-details-item">
      <label className="c-contact-details-item__label">{field.title}</label>
      <span className="c-contact-details-item__field">
        <Editable field={field} {...props} />
      </span>
    </li>
  )
}
