import React from 'react'
import { compose, withState, pure } from 'recompose'
import Editable from '../Editable'

const enhance = compose(pure, withState('isInvalid', 'setError', false))

const ZipCodeComponent = ({
  isInvalid,
  setError,
  zipCode,
  onChange,
  addressId
}) => {
  const validateZipCode = text => /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(text)
  const validate = (index, zipCode) => {
    if (!validateZipCode(zipCode)) {
      setError(true)
    } else {
      setError(false)
    }
  }

  const onChangeZipCode = (...args) => {
    if (validateZipCode(args[2])) {
      onChange(...args)
    }
  }

  return (
    <li className="c-contact-details-item">
      <label className="c-contact-details-item__label">Zip Code</label>
      <span className="c-contact-details-item__field">
        <Editable
          type="address"
          id={addressId}
          showEdit
          error={isInvalid}
          text={zipCode || '-'}
          validate={validate}
          onChange={onChangeZipCode}
        />
      </span>
    </li>
  )
}

export default enhance(ZipCodeComponent)
