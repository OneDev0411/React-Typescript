import React from 'react'
import { compose, withState } from 'recompose'
import Editable from '../Editable'

const enhance = compose(withState('errorIdItems', 'setErrorIdItem', []))

const Phones = ({
  phones,
  onAddAttribute,
  onChangeAttribute,
  errorIdItems,
  setErrorIdItem
}) => {
  const validatePhone = async phone => {
    if (phone) {
      const {
        PhoneNumberUtil
      } = await import('google-libphonenumber' /* webpackChunkName: "glpn" */)
      const phoneUtil = PhoneNumberUtil.getInstance()

      try {
        let phoneNumber = phoneUtil.parse(phone, 'US')

        return phoneUtil.isValidNumber(phoneNumber)
      } catch (e) {
        return false
      }
    } else {
      return false
    }
  }

  const validate = async (index, phone) => {
    const isNumberValid = await validatePhone(phone)

    if (!isNumberValid) {
      setErrorIdItem(errorIdItems.concat(index))
    } else {
      setErrorIdItem(errorIdItems.filter(e => e !== index))
    }
  }

  const onChangePhone = async (...args) => {
    const isNumberValid = await validatePhone(args[2])

    if (isNumberValid) {
      onChangeAttribute(...args)
    }
  }

  return (
    <div>
      {phones.map((item, key) => (
        <li key={`phone_${key}`}>
          <div className="name">Phone</div>
          <div className="data">
            <Editable
              type="phone_number"
              id={item.id}
              showEdit
              showAdd
              attributeName="phone_numbers"
              text={item.phone_number}
              onAdd={onAddAttribute}
              onChange={onChangePhone}
              validate={validate}
              error={errorIdItems.indexOf(key) > -1}
              index={key}
            />
          </div>
        </li>
      ))}

      {phones.length === 0 && (
        <li>
          <div className="name">Phone</div>
          <div className="data">
            <Editable
              type="phone_number"
              id={null}
              showEdit
              text="-"
              onChange={onChangePhone}
              validate={validate}
              error={errorIdItems.indexOf('new') > -1}
              index="new"
            />
          </div>
        </li>
      )}
    </div>
  )
}

export default enhance(Phones)
