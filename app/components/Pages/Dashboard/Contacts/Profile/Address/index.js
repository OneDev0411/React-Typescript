import React from 'react'
import Contact from '../../../../../../models/contacts'
import Editable from '../Editable'
import Zipcode from './zipcode'

export default ({ contact, onChangeAddress }) => (
  <div className="c-contact-profile-card address">
    <div className="c-contact-profile-card__title">Address</div>
    <div className="c-contact-profile-card__body">
      {Contact.get.addresses(contact).map((address, key) => (
        <ul key={`address_${key}`} className="u-unstyled-list">
          <li className="c-contact-detail-item">
            <label className="c-contact-detail-item__label">Street</label>
            <span className="c-contact-detail-item__field">
              <Editable
                type="address"
                id={address.id}
                showEdit
                text={address.street_name || '-'}
                onChange={(type, id, text) =>
                  onChangeAddress(address, 'street_name', id, text)
                }
              />
            </span>
          </li>
          <li className="c-contact-detail-item">
            <label className="c-contact-detail-item__label">City</label>
            <span className="c-contact-detail-item__field">
              <Editable
                type="address"
                id={address.id}
                showEdit
                text={address.city || '-'}
                onChange={(type, id, text) =>
                  onChangeAddress(address, 'city', id, text)
                }
              />
            </span>
          </li>
          <li className="c-contact-detail-item">
            <label className="c-contact-detail-item__label">State/region</label>
            <span className="c-contact-detail-item__field">
              <Editable
                type="address"
                id={address.id}
                showEdit
                text={address.state || '-'}
                onChange={(type, id, text) =>
                  onChangeAddress(address, 'state', id, text)
                }
              />
            </span>
          </li>
          <Zipcode
            addressId={address.id}
            zipCode={address.postal_code}
            onChange={(type, id, text) => {
              onChangeAddress(address, 'postal_code', id, text)
            }}
          />
        </ul>
      ))}
    </div>
  </div>
)
