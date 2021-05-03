import moment from 'moment'

import { IconButton, Theme, Tooltip, useTheme } from '@material-ui/core'

import {
  mdiFolderOutline,
  mdiAlertCircle,
  mdiCloseCircle,
  mdiCheckboxMarkedCircle
} from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

interface Props {
  deal: IDeal
  task: IDealTask
  isBackOffice: boolean
  onClick: () => void
}

export function TaskIcon({ deal, task, isBackOffice, onClick }: Props) {
  const theme = useTheme<Theme>()

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
    status = 'Needs Attention'
  }

  if (!isBackOffice && status !== 'Submitted' && task.attention_requested) {
    status = deal.is_draft ? 'Pending' : 'Notified'
  }

  if (status !== 'Approved' && task.required) {
    status = 'Required'
  }

  return (
    <Tooltip title={tooltip || status}>
      <IconButton onClick={onClick}>{getIcon(status, theme)}</IconButton>
    </Tooltip>
  )
}

function getIcon(status: string, theme: Theme) {
  switch (status) {
    case 'Required':
      return (
        <SvgIcon
          color={theme.palette.error.main}
          path={mdiFolderOutline}
          size={muiIconSizes.medium}
        />
      )

    case 'Pending':
    case 'Submitted':
    case 'Notified':
    case 'Needs Attention':
      return (
        <SvgIcon
          color={theme.palette.warning.main}
          path={mdiAlertCircle}
          size={muiIconSizes.medium}
        />
      )

    case 'Declined':
      return (
        <SvgIcon
          color={theme.palette.error.main}
          path={mdiCloseCircle}
          size={muiIconSizes.medium}
        />
      )

    case 'Approved':
      return (
        <SvgIcon
          color={theme.palette.success.main}
          path={mdiCheckboxMarkedCircle}
          size={muiIconSizes.medium}
        />
      )

    default:
      return <SvgIcon path={mdiFolderOutline} size={muiIconSizes.medium} />
  }
}
