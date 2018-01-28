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
    <li>
      <div className="name">Zipcode</div>
      <div className="data">
        <Editable
          type="address"
          id={addressId}
          showEdit
          error={isInvalid}
          text={zipCode || '-'}
          validate={validate}
          onChange={onChangeZipCode}
        />
      </div>
    </li>
  )
}

export default enhance(ZipCodeComponent)
