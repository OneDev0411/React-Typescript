import React from 'react'
import pure from 'recompose/pure'
import { Field } from 'redux-form'

const fields = ['last_3_month', 'last_6_month', 'last_year']

const SoldStatusChildrens = ({ name }) =>
  <ul className="c-filters-sold-status-childrens">
    {fields.map(field => {
      const id = `${name}__${field}`

      return (
        <li key={id} className="c-radio">
          <Field
            id={id}
            name={name}
            type="radio"
            value={field}
            component="input"
            className="c-radio__input"
          />
          <label htmlFor={id} className="c-radio__label">
            {field
              .split('_')
              .map(f => f.charAt(0).toUpperCase() + f.substr(1))
              .join(' ')}
          </label>
        </li>
      )
    })}
  </ul>

export default pure(SoldStatusChildrens)
