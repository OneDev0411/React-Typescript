import React from 'react'
import Contact from '../../../../../../../models/contacts'

export default function OrginalSource({ contact }) {
  return (
    <ul className="c-contact-details u-unstyled-list">
      <li className="c-contact-details-item">
        <span
          style={{
            fontWeight: 'bold'
          }}
          className="c-contact-details-item__label"
        >
          Original Source
        </span>
        <span className="c-contact-details-item__field">
          {Contact.get.source(contact).label || '-'}
        </span>
      </li>
    </ul>
  )
}
