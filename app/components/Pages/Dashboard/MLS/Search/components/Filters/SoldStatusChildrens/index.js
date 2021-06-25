import React from 'react'
import { Field } from 'redux-form'

// each index represent month period for minimum_sold_date
const fields = {
  last_3_months: '3',
  last_6_months: '6',
  last_year: '12'
}

const SoldStatusChildrens = ({ name }) => (
  <ul className="c-filters-sold-status-childrens" style={{ padding: '1rem 0' }}>
    {Object.keys(fields).map(field => {
      const id = `${name}__${field}`

      return (
        <li key={id} className="c-radio">
          <Field
            id={id}
            name={name}
            type="radio"
            value={fields[field]}
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
)

export default SoldStatusChildrens
