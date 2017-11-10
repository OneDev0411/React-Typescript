import React from 'react'
import { FormControl } from 'react-bootstrap'

export default ({
  list,
  attribute,
  prefix,
  placeholder,
  onChange,
  onAdd,
  onRemove,
  validationErrors,
  maxItems = 3
}) => (
  <div className="multiple">
    {
      list.map((item, key) =>
        <div
          className="m-row"
          key={`${prefix}_${key}`}
        >
          <FormControl
            placeholder={placeholder}
            value={list[key]}
            onChange={e => onChange(e, attribute, key)}
          />

          {
            key === 0 && list.length <= maxItems &&
            <img
              src="/static/images/contacts/add.svg"
              onClick={() => onAdd(attribute)}
            />
          }

          {
            key > 0 &&
            <img
              src="/static/images/contacts/remove.svg"
              onClick={e => onRemove(attribute, key)}
            />
          }
        </div>
      )
    }
  </div>
)
