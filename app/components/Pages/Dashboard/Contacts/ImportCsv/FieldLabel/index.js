import React, { Fragment } from 'react'
import Select from 'react-select'
import cn from 'classnames'

const AddressLabelOptions = [
  { label: 'Home Address', value: 'Home' },
  { label: 'Work Address', value: 'Work' },
  { label: 'Other Address', value: 'Other' }
]

const LabelOptions = {
  email: [
    { label: 'Personal Email', value: 'Personal' },
    { label: 'Work Email', value: 'Work' },
    { label: 'Other Email', value: 'Email' }
  ],
  phone_number: [
    { label: 'Mobile Phone', value: 'Mobile' },
    { label: 'Home Phone', value: 'Home' },
    { label: 'Work Phone', value: 'Work' },
    { label: 'Main Phone', value: 'Main' },
    { label: 'Other Phone', value: 'Other' }
  ],
  website: [
    { label: 'Website', value: 'Website' },
    { label: 'Instagram', value: 'Instagram' },
    { label: 'Facebook', value: 'Facebook' },
    { label: 'Twitter', value: 'Twitter' },
    { label: 'Blog', value: 'Blog' }
  ],
  street_name: AddressLabelOptions,
  city: AddressLabelOptions,
  state: AddressLabelOptions,
  country: AddressLabelOptions,
  postal_code: AddressLabelOptions
}

const FieldLabel = ({ fieldValue, contactField, fieldName, onChange }) => {
  const handleChangeValue = data => {
    const value = data ? data.value : null

    if (value !== fieldValue) {
      onChange(fieldName, value)
    }
  }

  return (
    <Fragment>
      <Select
        className={cn({ isInvalid: !fieldValue })}
        name="form-field-label"
        placeholder="Select Label"
        value={fieldValue}
        onChange={handleChangeValue}
        options={LabelOptions[contactField]}
      />
      {!fieldValue && <span className="required">Required</span>}
    </Fragment>
  )
}

export default FieldLabel
