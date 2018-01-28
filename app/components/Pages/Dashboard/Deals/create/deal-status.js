import React from 'react'
import _ from 'underscore'
import RadioButton from '../components/radio'

// list of statuses
const statuses = [
  'Active Contingent',
  'Active Kick Out',
  'Active Option Contract',
  'Pending'
]

export default ({
  clients, dealStatus, onChangeDealStatus, display
}) => (
  <div className="form-section deal-status">
    <div className="hero">
      What is the status of the deal? <span className="required">*</span>
    </div>

    {statuses.map((name, key) => (
      <div key={key} className="inline">
        <RadioButton
          selected={dealStatus === name}
          title={
            <span>
              <span className="status-color" />
              {name}
            </span>
          }
          onClick={() => onChangeDealStatus(name)}
        />
      </div>
    ))}
  </div>
)
