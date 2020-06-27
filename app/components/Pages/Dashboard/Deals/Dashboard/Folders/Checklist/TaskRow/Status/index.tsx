import React from 'react'
import moment from 'moment'
import Flex from 'styled-flex-component'
import { Tooltip } from '@material-ui/core'
import { mdiBellRingOutline, mdiAlertOutline, mdiCheck } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

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
      return <SvgIcon path={mdiBellRingOutline} size={muiIconSizes.xsmall} />

    case 'Declined':
      return <SvgIcon path={mdiAlertOutline} size={muiIconSizes.small} />

    case 'Approved':
      return <SvgIcon path={mdiCheck} size={muiIconSizes.small} />

    default:
      return null
  }
}
