import React from 'react'
import cn from 'classnames'
import RadioButton from '../components/radio'
import { getStatusColorClass } from '../../../../../utils/listing'

export default ({
  hasError,
  property_type,
  dealStatus,
  onChangeDealStatus
}) => {
  const statuses = property_type.includes('Lease')
    ? ['Lease', 'Lease Contract', 'Leased']
    : [
        'Active Contingent',
        'Active Kick Out',
        'Active Option Contract',
        'Pending'
      ]

  return (
    <div className="form-section deal-status">
      <div className={cn('hero', { hasError })}>
        What is the status of the deal? <span className="required">*</span>
      </div>

      {statuses.map((name, key) => (
        <div key={key} className="inline">
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
