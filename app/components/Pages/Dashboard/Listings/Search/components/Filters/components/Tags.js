import React from 'react'
import pure from 'recompose/pure'
import { Field } from 'redux-form'

import Label from './Label'

const Tags = ({
  name,
  label,
  fields
}) => (
  <Label label={label}>
    <div className="c-filters__tag-wrapper">
      {Object.keys(fields).map(field => {
        const value = fields[field]
        const id = `${name}__${field}`
        return (
          <label
            key={id}
            htmlFor={id}
            className="c-filters__tag">
            <Field
              id={id}
              value={value}
              type="checkbox"
              component="input"
              name={`${name}.${field}`}
              className="c-filters__tag__input"
            />
            <span className="c-filters__tag__text">{value}</span>
          </label>
        )
      })}
    </div>
  </Label>
)

export default pure(Tags)