import React from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import {
  deleteAttributes,
  upsertContactAttributes
} from '../../../../../../store_actions/contacts'

import { getContactAddresses } from '../../../../../../models/contacts/helpers/get-contact-addresses'

import {
  selectDefsBySection,
  selectDefinitionByName
} from '../../../../../../reducers/contacts/attributeDefs'

import ShadowButton from '../../../../../../views/components/Button/ShadowButton'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

import Label from '../Details/components/Label'
import Loading from '../../components/Loading'

import Field from './components/Field'
import AddAddressModal from './components/AddAddressModal'

export const LABELS_OPTIONS = {
  home: {
    name: 'Home',
    title: 'Home Address'
  },
  work: {
    name: 'Business',
    title: 'Business Address'
  },
  default: {
    name: 'Other',
    title: 'Other Address'
  }
}

const FIELDS = {
  postal_code: {
    validator: code => new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/).exec(code),
    validationText:
      'Please include numbers and dash. You have added a letter or special character.'
  }
}

const Addresses = ({
  addresses,
  isOpenModal,
  setShowModal,
  handleOnChangeLabel,
  handleDeleteAddress,
  handleAddNewAddress,
  handelOnChangePrimary,
  ...props
}) => (
  <div className="c-contact-profile-card">
    <div
      className="c-contact-profile-card__header"
      style={{ position: 'relative' }}
    >
      <h3 className="c-contact-profile-card__title">Addresses</h3>
      {addresses.length > 0 && (
        <ActionButton
          disabled={props.disabled}
          onClick={() => setShowModal(true)}
          style={{ position: 'absolute', top: '-6px', right: 0 }}
        >
          Add new address
        </ActionButton>
      )}
    </div>
    <div className="c-contact-profile-card__body">
      {addresses.length > 0 ? (
        <div style={{ position: 'relative' }}>
          {addresses.map(address => {
            const { fields, label, index, is_primary } = address

            return (
              <ul
                key={`${label}_address_${index}`}
                className="c-contact-details u-unstyled-list c-contact-details--address"
              >
                <li
                  key={`${label}_address__label`}
                  style={{ marginBottom: '1em' }}
                  className="c-contact-details-item"
                >
                  <span className="c-contact-details-item--multi__name-wrapper">
                    {addresses.length > 1 && (
                      <input
                        checked={is_primary}
                        className="c-contact-details-item--multi__primary"
                        data-balloon-pos="right"
                        data-balloon={is_primary ? 'Primary' : 'Set Primary'}
                        disabled={props.disabled}
                        onChange={() => handelOnChangePrimary(fields[0].index)}
                        type="radio"
                      />
                    )}

                    <Label
                      name={`address_${label}_${index}`}
                      field={fields[0]}
                      labels={LABELS_OPTIONS}
                      disabled={props.disabled}
                      onChange={handleOnChangeLabel}
                    />
                  </span>
                  <span
                    style={{ textAlign: 'right' }}
                    className="c-contact-details-item__field"
                  >
                    <ShadowButton
                      onClick={() => handleDeleteAddress(fields)}
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
                {fields.map(field => (
                  <Field
                    field={field}
                    key={`${label}_address_${index}__${field.attribute_def.id}`}
                    placeholder="-"
                    {...props}
                    {...FIELDS[field.attribute_def.name]}
                  />
                ))}
              </ul>
            )
          })}
          {props.disabled && <Loading />}
        </div>
      ) : (
        <div className="c-contact-details--address__no-address">
          <p>
            <i className="fa fa-building" />
            <span>No Address</span>
          </p>
          <ActionButton onClick={() => setShowModal(true)}>
            Add new address
          </ActionButton>
        </div>
      )}
    </div>

    {isOpenModal && (
      <AddAddressModal
        isOpen={isOpenModal}
        submitting={props.disabled}
        handleOnSubmit={handleAddNewAddress}
        handleOnClose={props.disabled ? () => {} : () => setShowModal(false)}
      />
    )}
  </div>
)

function mapStateToProps(state, props) {
  const { attributeDefs } = state.contacts
  const allAddressFields = getContactAddresses(props.contact)
  const addresses = getAddresses(attributeDefs, allAddressFields)

  return { allAddressFields, addresses, attributeDefs }
}

const enhance = compose(
  connect(mapStateToProps, {
    deleteAttributes,
    upsertContactAttributes
  }),
  withState('disabled', 'setDisabled', false),
  withState('isOpenModal', 'setShowModal', false),
  withHandlers({
    onChange: ({
      contact,
      setDisabled,
      upsertContactAttributes
    }) => async field => {
      try {
        setDisabled(true)

        let attribute
        const { data_type } = field.attribute_def

        if (field.id) {
          attribute = {
            id: field.id,
            [data_type]: field[data_type]
          }
        } else {
          attribute = {
            index: field.index,
            [data_type]: field[data_type],
            attribute_def: field.attribute_def.id
          }
        }

        await upsertContactAttributes(contact.id, [attribute])
      } catch (error) {
        throw error
      } finally {
        setDisabled(false)
      }
    }
  }),
  withHandlers({
    handleOnChangeLabel: ({
      contact,
      setDisabled,
      allAddressFields,
      upsertContactAttributes
    }) => async ({ index, label }) => {
      if (index == null) {
        throw new Error(`The index is ${index}`)
      }

      if (label == null) {
        throw new Error(`The label is ${index}`)
      }

      const attributes = allAddressFields
        .filter(field => field.index === index)
        .map(field => ({ ...field, label }))

      try {
        setDisabled(true)
        await upsertContactAttributes(contact.id, attributes)
      } catch (error) {
        throw error
      } finally {
        setDisabled(false)
      }
    }
  }),
  withHandlers({
    handelOnChangePrimary: ({
      contact,
      setDisabled,
      allAddressFields,
      upsertContactAttributes
    }) => async index => {
      try {
        setDisabled(true)

        const attributes = allAddressFields.map(field => {
          if (field.index === index) {
            return { ...field, is_primary: true }
          }

          return { ...field, is_primary: false }
        })

        await upsertContactAttributes(contact.id, attributes)
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
      setDisabled,
      upsertContactAttributes
    }) => async attribute => {
      try {
        setDisabled(true)

        const attributes = [
          {
            ...attribute,
            [attribute.attribute_def.data_type]: ''
          }
        ]

        await upsertContactAttributes(contact.id, attributes)
      } catch (error) {
        throw error
      } finally {
        setDisabled(false)
      }
    }
  }),
  withHandlers({
    handleDeleteAddress: ({
      contact,
      setDisabled,
      deleteAttributes
    }) => async fields => {
      setDisabled(true)

      try {
        const ids = fields
          .filter(field => field && field.id)
          .map(({ id }) => id)

        await deleteAttributes(contact.id, ids)
      } catch (error) {
        throw error
      } finally {
        setDisabled(false)
      }
    }
  }),
  withHandlers({
    handleAddNewAddress: ({
      contact,
      setDisabled,
      setShowModal,
      attributeDefs,
      allAddressFields,
      upsertContactAttributes
    }) => async values => {
      try {
        setDisabled(true)

        const attributes = []
        const index = getIndex(allAddressFields)

        Object.keys(values).forEach(key => {
          const attribute_def = selectDefinitionByName(attributeDefs, key)

          if (attribute_def) {
            attributes.push({
              index,
              attribute_def,
              label: values.label,
              is_primary: values.is_primary,
              [attribute_def.data_type]: values[key]
            })
          }
        })

        allAddressFields.forEach(attribute => {
          attributes.push({
            ...attribute,
            is_primary: false
          })
        })

        await upsertContactAttributes(contact.id, attributes)
      } catch (error) {
        setDisabled(false)
        throw error
      } finally {
        setDisabled(false)
        setShowModal(false)
      }
    }
  })
)

export default enhance(Addresses)

function getAddresses(attributeDefs, allAddressFields) {
  if (allAddressFields.length === 0) {
    return []
  }

  let addressesSectionDefs = selectDefsBySection(attributeDefs, 'Addresses')

  if (addressesSectionDefs.length === 0) {
    return []
  }

  let result = []

  const addresses = _.groupBy(allAddressFields, 'index')

  _.each(addresses, address => {
    let fields = address

    const indexedFields = _.indexBy(
      address,
      attribute => attribute.attribute_def.name
    )

    addressesSectionDefs.forEach(attribute_def => {
      let field = indexedFields[attribute_def.name]

      if (!field) {
        fields.push({
          attribute_def,
          index: address[0].index,
          [attribute_def.data_type]: null
        })
      }
    })

    fields = fields.filter(field => field.attribute_def.show)

    const { label, index, is_primary } = fields[0]

    if (fields.some(field => field[field.attribute_def.data_type])) {
      result.push({ index, label, fields, is_primary })
    }
  })

  return result
}

function getIndex(allAddressFields) {
  const index = allAddressFields
    .filter(({ index }) => index != null)
    .map(({ index }) => index)
    .reduce((a, b) => (a >= b ? a : b))

  return index + 1
}
