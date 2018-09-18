import React from 'react'
import cn from 'classnames'
import RadioButton from '../../../../../views/components/CheckmarkButton'
import { getStatusColorClass } from '../../../../../utils/listing'
import RequiredIcon from '../../../../../views/components/SvgIcons/Required/IconRequired'
import { H2 } from 'components/Typography/headings'

export default ({
  isRequired,
  hasError,
  property_type,
  dealStatus,
  onChangeDealStatus
}) => {
  const statuses = property_type.includes('Lease')
    ? ['Active', 'Lease Contract']
    : [
        'Active Contingent',
        'Active Kick Out',
        'Active Option Contract',
        'Pending'
      ]

  return (
    <div className="form-section deal-status">
      <H2 className={cn('hero', { hasError })}>
        What is the status of the deal?{' '}
        {isRequired && <span className="required">*</span>}
        {hasError && <RequiredIcon />}
      </H2>

      {statuses.map((name, key) => (
        <div key={key} className="deal-radio-row">
          <RadioButton
            selected={dealStatus === name}
            title={
              <span>
                <span
                  className="status-color"
                  style={{ background: getStatusColorClass(name) }}
                />

                {name}
              </span>
            }
            onClick={() => onChangeDealStatus(name)}
          />
        </div>
      ))}
    </div>
  )
}
