import React from 'react'
import cn from 'classnames'

import styled from 'styled-components'

import { H2 } from 'components/Typography/headings'

import RadioButton from 'components/RadioButton'
import { getStatusColorClass } from 'utils/listing'
import RequiredIcon from 'components/SvgIcons/Required/IconRequired'

const LabelBox = styled.span`
  display: inline-block;
  width: 20px;
  height: 12px;
  border-radius: 2px;
  background-color: #f5a623;
  margin: 0 8px 0 9px;
  background: ${({ name }) => getStatusColorClass(name)};
`

function getStatusList(dealSide, propertyType) {
  if (dealSide === 'Selling') {
    const isLeaseOrCommercial =
      propertyType.includes('Commercial') || propertyType.includes('Lease')

    return isLeaseOrCommercial ? [] : ['Coming Soon', 'Active']
  }

  return propertyType.includes('Lease')
    ? ['Active', 'Lease Contract']
    : [
        'Active Contingent',
        'Active Kick Out',
        'Active Option Contract',
        'Pending'
      ]
}

export default props => {
  const {
    isRequired,
    hasError,
    dealSide,
    propertyType,
    dealStatus,
    onChangeDealStatus
  } = props

  const statuses = getStatusList(dealSide, propertyType)

  if (statuses.length === 0) {
    return false
  }

  return (
    <div className="form-section deal-status">
      <H2 className={cn('hero', { hasError })}>
        What is the status of the deal?
        {isRequired && <span className="required">*</span>}
        {hasError && <RequiredIcon />}
      </H2>

      {statuses.map((name, key) => (
        <div key={key} className="deal-radio-row">
          <RadioButton
            selected={dealStatus === name}
            title={
              <span>
                <LabelBox name={name} />
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
