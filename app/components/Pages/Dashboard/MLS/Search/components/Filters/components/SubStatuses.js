import React from 'react'
import { Field } from 'redux-form'

import { mdiCheck } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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
            <SvgIcon path={mdiCheck} />
            <Flag color={`#${getStatusColor(value)}`} />
            {value}
          </label>
        </li>
      )
    })}
  </ul>
)

export default SubStatuses
