import React from 'react'
import Editable from '../Editable'

export default ({
  birthdays,
  onAddAttribute,
  onChangeAttribute
}) => (
  <div>
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
              text={item.birthday}
              onChange={onChangeAttribute.bind(this)}
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
            showAdd
            text="-"
            onAdd={onAddAttribute}
            onChange={onChangeAttribute}
          />
        </div>
      </li>
    }
  </div>
)
