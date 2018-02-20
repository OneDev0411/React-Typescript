import React from 'react'
import { compose, withState } from 'recompose'
import Editable from '../Editable'
import moment from 'moment'

const enhance = compose(withState('errorIdItems', 'setErrorIdItem', []))

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
      onChangeAttribute(args[0], args[1], moment(args[2]).valueOf() / 1000)
    }
  }

  let birthdayItems = (
    <div className="c-contact-detail-item">
      <label className="c-contact-detail-item__label">Birthday</label>
      <span className="c-contact-detail-item__field">
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
      </span>
    </div>
  )

  if (birthdays.length > 0) {
    birthdayItems = birthdays.map((item, key) => (
      <div
        className="c-contact-detail-item"
        key={`CONTACT__BIRTHDAY__${item.id}`}
      >
        <label className="c-contact-detail-item__label">Birthday</label>
        <span className="c-contact-detail-item__field">
          <Editable
            type="birthday"
            id={item.id}
            placeholder="mm / dd / yyyy"
            showEdit
            showAdd={false}
            text={moment(item.birthday * 1000).format('L')}
            onChange={onChangeBirthday}
            validate={validate}
            error={errorIdItems.indexOf(key) > -1}
            index={key}
          />
        </span>
      </div>
    ))
  }

  return birthdayItems
}

export default enhance(BirthdayComponent)
