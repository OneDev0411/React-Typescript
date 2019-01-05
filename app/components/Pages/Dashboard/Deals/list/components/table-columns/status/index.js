import React, { Fragment } from 'react'
import styled from 'styled-components'

import Deal from '../../../../../../../../models/Deal'
import { getStatusColorClass } from '../../../../../../../../utils/listing'

const StatusBullet = styled.span`
  display: inline-block;
  width: 15px;
  height: 9px;
  border-radius: 2px;
  margin-right: 9px;
`

const Status = ({ deal }) => {
  const status = Deal.get.status(deal)

  if (deal.is_draft) {
    return 'Draft'
  }

  return (
    <Fragment>
      <StatusBullet style={{ background: getStatusColorClass(status) }} />
      {status}
    </Fragment>
  )
}

export const statusSortMethod = ({ accessor }) => {
  const list = [
    'Active',
    'Lease',
    'Pending',
    'Active Option Contract',
    'Active Contingent',
    'Active Kick Out',
    'Lease Contract',
    'Sold',
    'Leased',
    'Expired',
    'Temp Off Market',
    'Cancelled',
    'Withdrawn',
    'Contract Terminated'
  ]

  const order = list.indexOf(accessor)

  return order > -1 ? order : list.length + 1
}

export default Status
