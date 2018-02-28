import React from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import {
  upsertContactAttributes,
  deleteAttributes
} from '../../../../../../store_actions/contacts'
import Contact from '../../../../../../models/contacts'
import City from './fields/City'
import State from './fields/State'
import Street from './fields/Street'
import PostalCode from './fields/PostalCode'
import Label from '../Details/components/Label'
import Loading from '../../components/Loading'
import ShadowButton from '../../../../../../views/components/Button/ShadowButton'

const LABELS_OPTIONS = {
  home: {
    title: 'Home Address'
  },
  office: {
    title: 'Office Address'
  },
  default: {
    title: 'Address'
  }
}

const Addresses = ({
  addresses,
  handleLabelOnChange,
  handleDeleteAddress,
  handelOnChangePrimary,
  ...props
}) => (
  <div className="c-contact-profile-card">
    <h3 className="c-contact-profile-card__title">Addresses</h3>
    <div className="c-contact-profile-card__body">
      {addresses.length > 0 ? (
        <div style={{ position: 'relative' }}>
          {addresses.map((address, index) => {
            const { id, fields, label, is_primary } = address
            const { street_name, city, state, postal_code } = fields
            const labelField = { id, label, type: 'label' }

            console.log(address)

            return (
              <ul
                key={`address__${id}`}
                className="c-contact-details u-unstyled-list c-contact-details--address"
              >
                {id && (
                  <li
                    key={`address_${id}_label`}
                    style={{ marginBottom: '1em' }}
                    className="c-contact-details-item"
                  >
                    <span className="c-contact-details-item--multi__name-wrapper">
                      {addresses.length > 1 &&
                        id && (
                          <input
                            type="radio"
                            name={`Address__${index}`}
                            disabled={props.disabled}
                            checked={is_primary}
                            onChange={() => handelOnChangePrimary(id)}
                            className="c-contact-details-item--multi__primary"
                            data-balloon-pos="right"
                            data-balloon={
                              is_primary ? 'Primary' : 'Set Primary'
                            }
                          />
                        )}

                      <Label
                        name={`address_${id}_label`}
                        field={labelField}
                        labels={LABELS_OPTIONS}
                        disabled={props.disabled}
                        onChange={handleLabelOnChange}
                      />
                    </span>
                    <span
                      style={{ textAlign: 'right' }}
                      className="c-contact-details-item__field"
                    >
                      <ShadowButton
                        onClick={() => handleDeleteAddress([id])}
                        hoverColor="#2196f3"
                      >
                        <i
                          className="fa fa-trash"
                          style={{ marginRight: '.5em' }}
                        />
                        <span>Delete Address</span>
                      </ShadowButton>
                    </span>
                  </li>
                )}
                <Street {...props} field={street_name} />
                <City {...props} field={city} />
                <State {...props} field={state} />
                <PostalCode {...props} field={postal_code} />
              </ul>
            )
          })}
          {props.disabled && <Loading />}
        </div>
      ) : (
        <div>No Address</div>
      )}
    </div>
  </div>
)

function mapStateToProps(state, props) {
  const { contact } = props
  const { id: contactId } = contact

  const addresses = getAddresses(contact)

  return { contactId, addresses }
}

const enhance = compose(
  connect(mapStateToProps, {
    deleteAttributes,
    upsertContactAttributes
  }),
  withState('disabled', 'setDisabled', false),
  withHandlers({
    onChange: ({
      contact,
      contactId,
      setDisabled,
      upsertContactAttributes
    }) => async fields => {
      setDisabled(true)

      try {
        const [field] = fields
        const { type: fieldType, id: fieldId } = field
        const address = getAddress({ fieldId, contact })
        let { is_primary } = address

        if (is_primary == null) {
          is_primary = true
        }

        const attributes = [
          {
            ...address,
            is_primary,
            type: 'address',
            [fieldType]: field[fieldType]
          }
        ]

        await upsertContactAttributes({
          contactId,
          attributes
        })
      } catch (error) {
        throw error
      } finally {
        setDisabled(false)
      }
    }
  }),
  withHandlers({
    handleLabelOnChange: ({ onChange }) => field => {
      if (field.id) {
        onChange([field])
      }
    }
  }),
  withHandlers({
    handelOnChangePrimary: ({
      contact,
      contactId,
      setDisabled,
      upsertContactAttributes
    }) => async addressId => {
      if (!addressId) {
        return
      }

      setDisabled(true)

      try {
        const addresses = Contact.get.addresses(contact)

        const attributes = addresses.filter(({ id }) => id).map(address => {
          if (address.id === addressId) {
            return { ...address, is_primary: true }
          }

          return { ...address, is_primary: false }
        })

        await upsertContactAttributes({
          contactId,
          attributes
        })
      } catch (error) {
        throw error
      } finally {
        setDisabled(false)
      }
    }
  }),
  withHandlers({
    onDelete: ({
      contact,
      contactId,
      setDisabled,
      upsertContactAttributes
    }) => async field => {
      setDisabled(true)

      try {
        const { type, id: fieldId } = field
        const address = getAddress({ fieldId, contact })

        const attributes = [
          {
            ...address,
            [type]: ''
          }
        ]

        await upsertContactAttributes({
          contactId,
          attributes
        })
      } catch (error) {
        throw error
      } finally {
        setDisabled(false)
      }
    }
  }),
  withHandlers({
    handleDeleteAddress: ({
      contactId,
      setDisabled,
      deleteAttributes
    }) => async attributesIds => {
      setDisabled(true)

      try {
        await deleteAttributes({
          contactId,
          attributesIds
        })
      } catch (error) {
        throw error
      } finally {
        setDisabled(false)
      }
    }
  })
)

export default enhance(Addresses)

function getAddress({ fieldId, contact }) {
  const addresses = _.indexBy(Contact.get.addresses(contact), 'id')

  return addresses[fieldId]
}

function getAddresses(contact) {
  let addresses = Contact.get.addresses(contact)

  const addressFields = {
    street_name: '',
    city: '',
    state: '',
    postal_code: ''
  }

  const getTitle = field =>
    field
      .split('_')
      .map(i => i.charAt(0).toUpperCase() + i.substr(1, i.length))
      .join(' ')

  if (addresses.length === 0) {
    addresses = [
      {
        id: undefined,
        label: 'Address',
        fields: addressFields,
        is_primary: true
      }
    ]
  }

  return addresses.map(address => {
    const { id, is_primary, label } = address
    const addressAttribute = {
      ...addressFields,
      ..._.pick(address, Object.keys(addressFields))
    }

    const fields = {}

    if (Object.keys(addressAttribute).length > 0) {
      Object.keys(addressAttribute).forEach(field => {
        fields[field] = {
          id,
          type: field,
          [field]: addressAttribute[field],
          title: getTitle(field)
        }
      })
    }

    return {
      id,
      label,
      fields,
      is_primary
    }
  })
}
