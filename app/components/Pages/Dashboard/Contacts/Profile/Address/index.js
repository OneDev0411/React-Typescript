import React from 'react'
import Contact from '../../../../../../models/Contact'
import Editable from '../Editable'
import Zipcode from './zipcode'

export default ({ contact, onChangeAddress }) => (
  <div className="card address">
    <div className="title">Address</div>
    {Contact.get.addresses(contact).map((address, key) => (
      <ul
        key={`address_${key}`}
        className="table"
        style={{ marginBottom: '10px' }}
      >
        <li>
          <div className="name">Address</div>
          <div className="data">
            <Editable
              type="address"
              id={address.id}
              showEdit
              text={address.street_name || '-'}
              onChange={(type, id, text) =>
                onChangeAddress(address, 'street_name', id, text)
              }
            />
          </div>
        </li>
        <li>
          <div className="name">City</div>
          <div className="data">
            <Editable
              type="address"
              id={address.id}
              showEdit
              text={address.city || '-'}
              onChange={(type, id, text) =>
                onChangeAddress(address, 'city', id, text)
              }
            />
          </div>
        </li>
        <li>
          <div className="name">State/region</div>
          <div className="data">
            <Editable
              type="address"
              id={address.id}
              showEdit
              text={address.state || '-'}
              onChange={(type, id, text) =>
                onChangeAddress(address, 'state', id, text)
              }
            />
          </div>
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
)
