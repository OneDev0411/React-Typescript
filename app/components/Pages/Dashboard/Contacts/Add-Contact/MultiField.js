import React from 'react'
import MaskedInput from 'react-text-mask'

export default ({
    list,
    attribute,
    prefix,
    placeholder,
    onChange,
    onAdd,
    onRemove,
    maxItems = 3,
    mask = false
}) => (
  <div className="multiple">
    {
      list.map((item, key) =>
        <div
          className="m-row"
          key={`${prefix}_${key}`}
        >
          <MaskedInput
            className="form-control"
            mask={mask}
            guide={false}
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
            <i
              className="fa fa-times fa-2x"
              onClick={e => onRemove(attribute, key)}
            ></i>
          }
        </div>
      )
    }
  </div>
)
