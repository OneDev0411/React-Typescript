import React from 'react'
import { Field } from 'redux-form'

import Flag from '../FiltersListingsStatusRow/Flag'
import { getStatusColor } from '../../../../../../../../utils/listing'

const name = 'listing_statuses'

const SubStatuses = ({ fields }) => (
  <ul className="c-filters-sub-statuses">
    {Object.keys(fields).map(field => {
      const id = `${name}__${field}`
      const value = fields[field]

      return (
        <li key={id} className="c-filters-sub-statuses__item">
          <Field
            id={id}
            type="checkbox"
            component="input"
            name={`${name}.${field}`}
            normalize={v => (v ? value : null)}
          />
          <label htmlFor={id}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            <Flag color={`#${getStatusColor(value)}`} />
            {value}
          </label>
        </li>
      )
    })}
  </ul>
)

export default SubStatuses
