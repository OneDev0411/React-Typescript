import React from 'react'
import pure from 'recompose/pure'
import { Field } from 'redux-form'

const fields = [
  'canclled',
  'expired',
  'contingent',
  'kick_out',
  'option_contract',
  'pending',
  'temp_off_market',
  'withdrawn',
  'withdrawn_sublisting'
]

const name = 'listing_statuses'

const OtherStatusesChildrens = () =>
  <ul className="c-filters-other-statuses-childrens">
    {fields.map(field => {
      const id = `${name}__${field}`

      return (
        <li key={id} className="c-filters-other-statuses-childrens__item">
          <Field
            id={id}
            type="checkbox"
            component="input"
            name={`${name}.${field}`}
          />
          <label htmlFor={id}>
            <svg
              width="20"
              height="20"
              fill="#2196f3"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            {field
              .split('_')
              .map(f => f.charAt(0).toUpperCase() + f.substr(1))
              .join(' ')}
          </label>
        </li>
      )
    })}
  </ul>

export default pure(OtherStatusesChildrens)
