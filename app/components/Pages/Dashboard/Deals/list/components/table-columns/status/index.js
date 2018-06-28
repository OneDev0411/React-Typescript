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

  return (
    <Fragment>
      <StatusBullet style={{ background: getStatusColorClass(status) }} />
      {status}
    </Fragment>
  )
}

export default Status
