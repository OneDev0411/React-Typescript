import React from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import { upsertContactAttributes } from '../../../../../../store_actions/contacts'
import Contact from '../../../../../../models/contacts'
import City from './fields/City'
import State from './fields/State'
import Street from './fields/Street'
import PostalCode from './fields/PostalCode'

const Addresses = ({ addresses, ...props }) => (
  <div className="c-contact-profile-card">
    <h3 className="c-contact-profile-card__title">Addresses</h3>
    <div className="c-contact-profile-card__body">
      {addresses.map(
        ({ id, fields: { street_name, city, state, postal_code } }) => (
          <ul
            key={`address__${id}`}
            className="c-contact-details u-unstyled-list"
          >
            <Street {...props} field={street_name} />
            <City {...props} field={city} />
            <State {...props} field={state} />
            <PostalCode {...props} field={postal_code} />

            {props.disabled && (
              <div className="c-contact-details__saving-cover">
                <span style={{ color: '#2196f3' }}>
                  <i className="fa fa-spin fa-spinner" />
                  {'  '}
                  Saving ...
                </span>
              </div>
            )}
          </ul>
        )
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
        const { type, id: fieldId } = field
        const address = getAddress({ fieldId, contact })

        const attributes = [
          {
            ...address,
            [type]: field[type]
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
  })
)

export default enhance(Addresses)

function getAddress({ fieldId, contact }) {
  const addresses = _.indexBy(Contact.get.addresses(contact), 'id')

  return addresses[fieldId]
}

function getAddresses(contact) {
  const addresses = Contact.get.addresses(contact)

  const addressFields = {
    street_name: '-',
    city: '-',
    state: '-',
    postal_code: '-'
  }

  const getTitle = field =>
    field
      .split('_')
      .map(i => i.charAt(0).toUpperCase() + i.substr(1, i.length))
      .join(' ')

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
