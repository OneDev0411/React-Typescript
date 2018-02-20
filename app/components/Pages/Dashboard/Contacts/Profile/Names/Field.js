import React from 'react'
import { compose, withState } from 'recompose'
import Editable from '../Editable'

function Field({ field, onChange, setErrorIdItem, errorIdItems }) {
  const { id, name, value, title } = field

  const isValidName = name =>
    name && name.trim().length > 0 && new RegExp(/^[A-Za-z\s]+$/).exec(name)

  const validate = (index, name) => {
    if (!isValidName(name)) {
      setErrorIdItem(errorIdItems.concat(index))
    } else {
      setErrorIdItem(errorIdItems.filter(e => e !== index))
    }
  }

  return (
    <li className="c-contact-detail-item">
      <label className="c-contact-detail-item__label">{title}</label>
      <span className="c-contact-detail-item__field">
        <Editable
          id={id}
          showEdit
          type={name}
          text={value}
          index={name}
          showAdd={false}
          validate={validate}
          onChange={onChange}
          error={errorIdItems.includes(name)}
        />
      </span>
    </li>
  )
}

export default compose(withState('errorIdItems', 'setErrorIdItem', []))(Field)
