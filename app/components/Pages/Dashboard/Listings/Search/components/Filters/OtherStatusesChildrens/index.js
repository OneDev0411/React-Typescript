import React from 'react'
import pure from 'recompose/pure'
import { Field } from 'redux-form'

const checkboxs = {
  canclled: 'Canclled',
  expired: 'Expired',
  contingent: 'Contingent',
  kickOut: 'Kick Out',
  optionContract: 'Option Contract',
  pending: 'Pending',
  tempOffMarket: 'Temp Off Market',
  withdrawn: 'Withdrawn',
  withdrawnSublisting: 'Withdrawn Sublisting'
}

const Checkbox = field => {
  return (
    <input
      {...field.input}
      type={field.type}
      className="checkbox"
      id={field.id}
    />
  )
}

const OtherStatusesChildrens = ({ name }) =>
  <ul className="c-filters-other-statuses-childrens">
    {Object.keys(checkboxs).map(field => {
      const id = `${name}__${field}`

      return (
        <li key={id} className="c-filters-other-statuses-childrens__item">
          <Field
            type="checkbox"
            name={`${name}.${field}`}
            component={Checkbox}
            id={id}
          />
          <label htmlFor={id}>
            <svg
              fill="#2196f3"
              height="20"
              viewBox="0 0 24 24"
              width="20"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            {checkboxs[field]}
          </label>
        </li>
      )
    })}
  </ul>

export default pure(OtherStatusesChildrens)
