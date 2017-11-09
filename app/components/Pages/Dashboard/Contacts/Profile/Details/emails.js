import React from 'react'
import Editable from '../Editable'

export default ({
  emails,
  onAddAttribute,
  onChangeAttribute
}) => (
  <div>
    {
      emails.map((item, key) => (
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
              onChange={onChangeAttribute}
            />
          </div>
        </li>
      ))
    }

    {
      emails.length === 0 &&
      <li>
        <div className="name">Email</div>
        <div className="data">
          <Editable
            type="email"
            id={null}
            showEdit
            text=""
            onChange={onChangeAttribute}
          />
        </div>
      </li>
    }
  </div>
)
