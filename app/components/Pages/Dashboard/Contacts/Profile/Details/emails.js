import React from 'react'
import { compose, withState, pure } from 'recompose'

import Editable from '../Editable'

const enhance = compose(pure, withState('errorIdItems', 'setErrorIdItem', []))

const Emails = ({
  emails,
  onAddAttribute,
  onChangeAttribute,
  errorIdItems,
  setErrorIdItem
}) => {
  const validateEmail = email => {
    // eslint-disable-next-line max-len
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return re.test(email)
  }
  const validate = (index, email) => {
    if (!validateEmail(email)) {
      setErrorIdItem(errorIdItems.concat(index))
    } else {
      setErrorIdItem(errorIdItems.filter(e => e !== index))
    }
  }

  const onChangeEmail = (...args) => {
    const isEmailValid = validateEmail(args[2])

    if (isEmailValid) {
      onChangeAttribute(...args)
    }
  }

  return (
    <div>
      {emails.map((item, key) => (
        <li key={`email_${key}`}>
          <div className="name">Email</div>
          <div className="data">
            <Editable
              type="email"
              id={item.id}
              showEdit
              showAdd
              text={item.email}
              onAdd={onAddAttribute}
              onChange={onChangeEmail}
              validate={validate}
              error={errorIdItems.indexOf(key) > -1}
              index={key}
            />
          </div>
        </li>
      ))}

      {emails.length === 0 && (
        <li>
          <div className="name">Email</div>
          <div className="data">
            <Editable
              type="email"
              id={null}
              showEdit
              text=""
              onChange={onChangeEmail}
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

export default enhance(Emails)
