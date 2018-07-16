import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'

import { selectDefsBySection } from '../../../../../../../reducers/contacts/attributeDefs'
import { FinalFormDrawer } from '../../../../../../../views/components/FinalFormDrawer'
import AddButton from '../../../../../../../views/components/Button/ActionButton'
import DeleteButton from '../../../../../../../views/components/Button/IconButton'
import DeleteIcon from '../../../../../../../views/components/SvgIcons/Delete/IconDelete'
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

class EditForm extends React.Component {
  state = {
    submitting: false
  }
  onSubmit = values => {
    preSaveFormat(values)
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
    const { addresses } = this.props
    const labelOptions = addresses[0].fields[0].attribute_def.labels.map(
      value => ({
        title: value,
        value
      })
    )

    return (
      <FinalFormDrawer
        initialValues={getInitialValues(addresses)}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        onSubmit={this.onSubmit}
        submitting={this.state.submitting}
        title="Edit Addresses"
      >
        <FieldArray name="addresses">
          {({ fields }) => (
            <div>
              {fields.map((name, index) => {
                const address = this.getAddress(
                  fields.value[index].addressIndex
                )
                const isEmpty =
                  address &&
                  !address.fields.some(
                    field => field[field.attribute_def.data_type]
                  )

                return (
                  <div key={name}>
                    {(addresses.length > 1 || !isEmpty) && (
                      <div
                        style={{
                          position: 'relative',
                          padding: '1em',
                          backgroundColor: '#ecf1f6'
                        }}
                      >
                        <p style={{ color: '#778a9f' }}>
                          {(address && address.label) || 'Other'}
                        </p>
                        <p style={{ color: '#263d50' }}>
                          {(address && getFullAddress(address.fields)) || '-'}
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
                            value={
                              (address && address.addressIndex) ||
                              getAddressIndex(addresses)
                            }
                          />
                          {'    '}
                          Set as primary address
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
                        items={labelOptions}
                        label="Label"
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

              <div style={{ padding: '1em' }}>
                <AddButton
                  onClick={() =>
                    fields.push(
                      getEmptyAddress(
                        this.props.addressAttributeDefs,
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

EditForm.propTypes = propTypes

function mapStateToProps(state) {
  const addressAttributeDefs = selectDefsBySection(
    state.contacts.attributeDefs,
    'Addresses'
  )

  return { addressAttributeDefs }
}

export default connect(mapStateToProps)(EditForm)
