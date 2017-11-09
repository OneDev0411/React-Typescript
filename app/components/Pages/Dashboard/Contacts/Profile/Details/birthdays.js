import React from 'react'
import { connect } from 'react-redux'
import Editable from '../Editable'
import moment from 'moment'

import { addNotification as notify } from 'reapop'

const BirthdayComponent = ({
  birthdays,
  onChangeAttribute,
  notify
}) => {
  const onChangeBirthday = (...args) => {
    let momentObj = moment(args[2])

    if (momentObj.isValid()) {
      onChangeAttribute(args[0], args[1], momentObj.valueOf())
    } else {
      notify({
        message: 'Invalid birthday.',
        status: 'error'
      })
    }
  }

  return <div>
    {
      birthdays.map((item, key) => (
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
            />
          </div>
        </li>
      ))
    }

    {
      birthdays.length === 0 &&
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
          />
        </div>
      </li>
    }
  </div>
}

export default connect(null, { notify })(BirthdayComponent)