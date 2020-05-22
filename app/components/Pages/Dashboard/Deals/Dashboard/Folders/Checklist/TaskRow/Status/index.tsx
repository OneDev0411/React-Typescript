import React from 'react'
import moment from 'moment'

import Flex from 'styled-flex-component'

import { Tooltip } from '@material-ui/core'

import PendingIcon from 'components/SvgIcons/DealTaskPending/IconPending'
import DeclinedIcon from 'components/SvgIcons/DealTaskDeclined/IconDeclined'
import ApprovedIcon from 'components/SvgIcons/DealTaskApproved/IconApproved'

import { Label } from './styled'

interface Props {
  deal: IDeal
  task: IDealTask
  isBackOffice: boolean
}

export function TaskStatus({ deal, task, isBackOffice }: Props) {
  if (!task) {
    return null
  }

  let status: string = ''
  let tooltip: string = ''

  if (task.review) {
    status = task.review.status

    const reviewTime = moment.unix(task.review.created_at)

    tooltip = 'Status: '
    tooltip += reviewTime.isValid()
      ? `(${status}, ${reviewTime.format('MMMM DD, YY [at] hh:mm A')})`
      : `${status}`
  }

  if (isBackOffice && (status === 'Submitted' || task.attention_requested)) {
    status = 'NEEDS ATTENTION'
  }

  if (!isBackOffice && status !== 'Submitted' && task.attention_requested) {
    status = deal.is_draft ? 'Pending' : 'Notified'
  }

  const isRequired = status !== 'Approved' && task.required

  if (!status && !isRequired) {
    return null
  }

  return (
    <Flex>
      {isRequired && <Label className="Required">Required</Label>}

      {status && (
        <Tooltip title={tooltip} placement="bottom">
          <Label className={status}>
            {getIcon(status)} {status}
          </Label>
        </Tooltip>
      )}
    </Flex>
  )
}

function getIcon(status: string) {
  switch (status) {
    case 'Pending':
    case 'Submitted':
    case 'Notified':
      return <PendingIcon />

    case 'Declined':
      return <DeclinedIcon />

    case 'Approved':
      return <ApprovedIcon />

    default:
      return null
  }
}
