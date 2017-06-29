import React from 'react'
import pure from 'recompose/pure'
import { Field } from 'redux-form'

const radios = {
  lastThreeMonth: 'Last 3 Month',
  lastSixMonth: 'Last 6 Month',
  lastYear: 'Last Year'
}

const Radio = field =>
  <input
    {...field.input}
    id={field.id}
    type={field.type}
    className="c-radio__input"
  />

const SoldStatusChildrens = ({ name }) =>
  <ul className="c-filters-sold-status-childrens">
    {Object.keys(radios).map(field => {
      const id = `${name}__${field}`

      return (
        <li key={id} className="c-radio">
          <Field
            id={id}
            name={name}
            type="radio"
            value={field}
            component={Radio}
          />
          <label htmlFor={id} className="c-radio__label">
            {radios[field]}
          </label>
        </li>
      )
    })}
  </ul>

export default pure(SoldStatusChildrens)
