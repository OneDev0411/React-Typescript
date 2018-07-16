import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { addNotification as notify } from 'reapop'

import AddButton from '../../../../../../../views/components/Button/ActionButton'
// import DeleteButton from '../../../../../../../views/components/Button/IconButton'
// import DeleteIcon from '../../../../../../../views/components/SvgIcons/Delete/IconDelete'
import { upsertContactAttributes } from '../../../../../../../store_actions/contacts/upsert-contact-attributes'
import { FinalFormDrawer } from '../../../../../../../views/components/FinalFormDrawer'
import {
  TextField,
  Select
} from '../../../../../../../views/components/final-form-fields'

import { getFullAddress } from '../helpers/get-full-address'
import {
  getAddressIndex,
  getEmptyAddress,
  getInitialValues,
  preSaveFormat
} from './helpers'

const propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

class EditAddressesForm extends React.Component {
  onSubmit = async values => {
    try {
      const attributes = preSaveFormat(values)

      await this.props.dispatch(
        upsertContactAttributes(this.props.contact.id, attributes)
      )

      this.props.onClose()
      this.props.dispatch(
        notify({
          status: 'success',
          dismissAfter: 4000,
          message: 'Addresses updated.'
        })
      )
    } catch (error) {
      console.log(error)
    }
  }

  getAddress = index => {
    const idxAddresses = {}

    this.props.addresses.forEach(address => {
      if (address.index != null) {
        idxAddresses[address.index] = address
      }
    })

    if (idxAddresses[index]) {
      return idxAddresses[index]
    }

    return null
  }

  render() {
    const { addresses, addressAttributeDefs } = this.props

    if (addressAttributeDefs.length === 0) {
      return null
    }

    return (
      <FinalFormDrawer
        initialValues={getInitialValues(addresses, addressAttributeDefs)}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        onSubmit={this.onSubmit}
        title="Edit Addresses"
      >
        <FieldArray name="addresses">
          {({ fields }) => (
            <div>
              {fields.map((name, index) => {
                const address = this.getAddress(
                  fields.value[index].addressIndex
                )

                return (
                  <div key={name}>
                    {(addresses.length > 0 || fields.value.length > 1) && (
                      <div
                        style={{
                          position: 'relative',
                          padding: '1em',
                          backgroundColor: '#ecf1f6'
                        }}
                      >
                        <p style={{ color: '#778a9f', fontWeight: 500 }}>
                          {(address && address.label) || 'Other'}
                        </p>
                        <p style={{ color: '#263d50', fontSize: '1.6rem' }}>
                          <b>
                            {(address && getFullAddress(address.fields)) || '-'}
                          </b>
                        </p>
                        <label
                          htmlFor={`is_primary_${index}`}
                          style={{ color: '#415467' }}
                        >
                          <Field
                            id={`is_primary_${index}`}
                            name="is_primary"
                            component="input"
                            type="radio"
                            parse={value => Number(value)}
                            value={
                              address != null
                                ? address.index
                                : getAddressIndex(addresses)
                            }
                          />
                          <span
                            style={{ marginLeft: '0.5em', fontWeight: 400 }}
                          >
                            Set as primary address
                          </span>
                        </label>
                        {/* <DeleteButton
                            color="#778a9f"
                            hoverColor="#263d50"
                            onClick={() => fields.remove(index)}
                            style={{
                              position: 'absolute',
                              top: '1.4rem',
                              right: '1.4rem'
                            }}
                          >
                            <DeleteIcon />
                          </DeleteButton> */}
                      </div>
                    )}
                    <div>
                      <Select
                        hasEmptyItem={false}
                        items={['Home', 'Work', 'Other'].map(value => ({
                          title: value,
                          value
                        }))}
                        label="Address Type"
                        name={`${name}.label`}
                      />
                      <TextField
                        label="Street Number"
                        name={`${name}.street_number.value`}
                      />
                      <TextField
                        label="Street Prefix"
                        name={`${name}.street_prefix.value`}
                      />
                      <TextField
                        label="Street Name"
                        name={`${name}.street_name.value`}
                      />
                      <TextField
                        label="Street Suffix"
                        name={`${name}.street_suffix.value`}
                      />
                      <TextField
                        label="Unit Number"
                        name={`${name}.unit_number.value`}
                      />
                      <TextField label="City" name={`${name}.city.value`} />
                      <TextField label="State" name={`${name}.state.value`} />
                      <TextField
                        label="Zip Code"
                        name={`${name}.postal_code.value`}
                        placeholder="65619 or 34353-2323"
                      />
                    </div>
                  </div>
                )
              })}

              <div style={{ padding: '2em', textAlign: 'center' }}>
                <AddButton
                  inverse
                  style={{ fontSize: '1.6rem' }}
                  onClick={() =>
                    fields.push(
                      getEmptyAddress(
                        addressAttributeDefs,
                        getAddressIndex(addresses)
                      )
                    )
                  }
                >
                  Add a new address
                </AddButton>
              </div>
            </div>
          )}
        </FieldArray>
      </FinalFormDrawer>
    )
  }
}

EditAddressesForm.propTypes = propTypes

export default connect()(EditAddressesForm)
