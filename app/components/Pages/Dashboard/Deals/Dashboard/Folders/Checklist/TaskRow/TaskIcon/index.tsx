import moment from 'moment'

import { IconButton, Theme, Tooltip, useTheme } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import {
  dealApprovedFolder,
  dealApprovedFolderOpen,
  dealDeclinedFolderOpen,
  dealDeclinedFolder,
  dealDefaultFolder,
  dealDefaultFolderOpen,
  dealNotifiedFolder,
  dealNotifiedFolderOpen,
  dealRequiredFolder,
  dealRequiredFolderOpen
} from 'components/SvgIcons/icons'

interface Props {
  deal: IDeal
  task: IDealTask
  isTaskExpanded: boolean
  isBackOffice: boolean
  onClick: () => void
}

export function TaskIcon({
  deal,
  task,
  isBackOffice,
  isTaskExpanded,
  onClick
}: Props) {
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
    tooltip = ''
    status = 'Needs Attention'
  }

  if (!isBackOffice && status !== 'Submitted' && task.attention_requested) {
    tooltip = ''
    status = deal.is_draft ? 'Pending' : 'Notified'
  }

  if (status !== 'Approved' && task.required) {
    status = 'Required'
  }

  return (
    <Tooltip title={tooltip || status} placement="left">
      <IconButton onClick={onClick}>
        {getIcon(isTaskExpanded, status, theme)}
      </IconButton>
    </Tooltip>
  )
}

function getIcon(isTaskExpanded: boolean, status: string, theme: Theme) {
  switch (status) {
    case 'Required':
      return (
        <SvgIcon
          color={theme.palette.error.main}
          path={isTaskExpanded ? dealRequiredFolderOpen : dealRequiredFolder}
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
          path={isTaskExpanded ? dealNotifiedFolderOpen : dealNotifiedFolder}
          size={muiIconSizes.medium}
        />
      )

    case 'Declined':
      return (
        <SvgIcon
          color={theme.palette.error.main}
          path={isTaskExpanded ? dealDeclinedFolderOpen : dealDeclinedFolder}
          size={muiIconSizes.medium}
        />
      )

    case 'Approved':
      return (
        <SvgIcon
          color={theme.palette.success.main}
          path={isTaskExpanded ? dealApprovedFolderOpen : dealApprovedFolder}
          size={muiIconSizes.medium}
        />
      )

    default:
      return (
        <SvgIcon
          path={isTaskExpanded ? dealDefaultFolderOpen : dealDefaultFolder}
          size={muiIconSizes.medium}
        />
      )
  }
}
