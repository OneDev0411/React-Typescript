import React from 'react'
import { compose, withState } from 'recompose'
import Editable from '../Editable'

const labelStyle = {
  width: '40%',
  margin: 0,
  lineHeight: 2,
  fontWeight: 'normal'
}

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

  const handleOnChange = (type, id, text) => {
    if (isValidName(text)) {
      onChange(type, id, text)
    }
  }

  return (
    <li>
      <label htmlFor={name} style={labelStyle} className="name">
        {title}
      </label>
      <div className="data">
        <Editable
          id={id}
          showEdit
          type={name}
          text={value}
          index={name}
          showAdd={false}
          validate={validate}
          onChange={handleOnChange}
          error={errorIdItems.includes(name)}
        />
      </div>
    </li>
  )
}

export default compose(withState('errorIdItems', 'setErrorIdItem', []))(Field)
