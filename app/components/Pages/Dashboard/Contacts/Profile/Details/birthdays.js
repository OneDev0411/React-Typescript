import React from 'react'
import { compose, withState, pure } from 'recompose'
import Editable from '../Editable'
import moment from 'moment'

const enhance = compose(pure, withState('errorIdItems', 'setErrorIdItem', []))

const BirthdayComponent = ({
  birthdays,
  onChangeAttribute,
  errorIdItems,
  setErrorIdItem
}) => {
  const validateBirthday = birthday => {
    let momentObj = moment(birthday)

    return momentObj.isValid()
  }
  const validate = (index, birthday) => {
    if (!validateBirthday(birthday)) {
      setErrorIdItem(errorIdItems.concat(index))
    } else {
      setErrorIdItem(errorIdItems.filter(e => e !== index))
    }
  }

  const onChangeBirthday = (...args) => {
    if (validateBirthday(args[2])) {
      onChangeAttribute(args[0], args[1], moment(args[2]).valueOf())
    }
  }

  return (
    <div>
      {birthdays.map((item, key) => (
        <li key={`birthday_${key}`}>
          <div className="name">Birthday</div>
          <div className="data">
            <Editable
              type="birthday"
              id={item.id}
              placeholder="mm / dd / yyyy"
              showEdit
              showAdd={false}
              text={moment(item.birthday).format('L')}
              onChange={onChangeBirthday}
              validate={validate}
              error={errorIdItems.indexOf(key) > -1}
              index={key}
            />
          </div>
        </li>
      ))}

      {birthdays.length === 0 && (
        <li>
          <div className="name">Birthday</div>
          <div className="data">
            <Editable
              type="birthday"
              id={null}
              showEdit
              showAdd={false}
              text="-"
              onChange={onChangeBirthday}
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

export default enhance(BirthdayComponent)
