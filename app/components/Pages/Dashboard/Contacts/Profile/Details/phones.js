import React from 'react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'
import Editable from '../Editable'

const Phones = ({
  fields,
  handleAddNewField,
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
      {fields.map((item, key) => (
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
              onAdd={handleAddNewField}
              onChange={onChangePhone}
              validate={validate}
              error={errorIdItems.indexOf(key) > -1}
              index={key}
            />
          </div>
        </li>
      ))}

      {fields.length === 0 && (
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

const enhance = compose(
  withState('errorIdItems', 'setErrorIdItem', []),
  withState('fields', 'addNewfields', ({ items }) => items),
  withHandlers({
    handleAddNewField: ({ addNewfields, fields }) => () => {
      const newField = {
        id: undefined,
        type: 'phone_number',
        phone_number: 'Enter new phone number'
      }

      addNewfields([...fields, newField])
    }
  }),
  withPropsOnChange(['items'], ({ items, addNewfields }) => {
    addNewfields(items)

    return {}
  })
)

export default enhance(Phones)
