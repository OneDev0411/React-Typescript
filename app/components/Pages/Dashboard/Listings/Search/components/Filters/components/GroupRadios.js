import React from 'react'
import { Field } from 'redux-form'

import Label from './Label'

const getItemWidth = length =>
  `calc(100% / ${length} - (${length - 1}px / ${length}))`

const _fields = [
  { title: 'Any', value: 'any' },
  { title: '+1', value: '1' },
  { title: '+2', value: '2' },
  { title: '+3', value: '3' },
  { title: '+4', value: '4' },
  { title: '+5', value: '5' }
]

const GroupRadios = ({ name, label, fields = _fields }) => (
  <Label label={label}>
    <div className="c-group-radios">
      {fields.map(field => {
        const { value, title } = field
        const id = `${name}__${value}`

        return (
          <label
            key={id}
            htmlFor={id}
            className="c-group-radios__item-label"
            style={{ width: getItemWidth(fields.length) }}
          >
            <Field
              id={id}
              name={name}
              type="radio"
              value={value}
              component="input"
              className="c-group-radios__item-input"
            />
            <span className="c-group-radios__item-label__text">{title}</span>
          </label>
        )
      })}
    </div>
  </Label>
)

export default GroupRadios
