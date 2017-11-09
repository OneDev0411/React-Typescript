import React from 'react'
import Editable from '../Editable'

export default ({
  phones,
  onAddAttribute,
  onChangeAttribute
}) => (
  <div>
    {
      phones.map((item, key) => (
        <li key={`phone_${key}`}>
          <div className="name">Phone</div>
          <div className="data">
            <Editable
              type="phone_number"
              id={item.id}
              showEdit
              showAdd
              text={item.phone_number}
              onAdd={onAddAttribute}
              onChange={onChangeAttribute}
            />
          </div>
        </li>
      ))
    }

    {
      phones.length === 0 &&
      <li>
        <div className="name">Phone</div>
        <div className="data">
          <Editable
            type="phone_number"
            id={null}
            showEdit
            text="-"
            onChange={onChangeAttribute}
          />
        </div>
      </li>
    }
  </div>
)
