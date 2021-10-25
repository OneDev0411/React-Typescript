import { Box, Chip, Theme, Tooltip, useTheme } from '@material-ui/core'
import moment from 'moment'

interface Props {
  deal: IDeal
  task: IDealTask
  isBackOffice: boolean
}

export function TaskBadge({ deal, task, isBackOffice }: Props) {
  const theme = useTheme<Theme>()

  if (!task) {
    return null
  }

  let status: string = ''
  let tooltip: string = ''

  if (task.review) {
    status = task.review.status

    const reviewTime = moment.unix(task.review.created_at)

    tooltip = reviewTime.isValid()
      ? `${status}, ${reviewTime.format('MMMM DD, YY [at] hh:mm A')}`
      : `${status}`
  }

  if (['Approved', 'Declined'].includes(status) === false && task.required) {
    status = 'Required'
  }

  if (isBackOffice && (status === 'Submitted' || task.attention_requested)) {
    tooltip = ''
    status = 'Needs Attention'
  }

  if (!isBackOffice && status !== 'Submitted' && task.attention_requested) {
    tooltip = ''
    status = deal.is_draft ? 'Pending' : 'Notified'
  }

  return (
    <Box ml={1}>
      <Tooltip title={tooltip || status} placement="left">
        <>{getBadge(status, theme)}</>
      </Tooltip>
    </Box>
  )
}

function getBadge(status: string, theme: Theme) {
  switch (status) {
    case 'Pending':
    case 'Submitted':
    case 'Notified':
      return (
        <Chip
          size="small"
          label="Notified"
          style={{
            backgroundColor: theme.palette.warning.ultralight,
            color: theme.palette.warning.main
          }}
        />
      )

    case 'Needs Attention':
      return (
        <Chip
          size="small"
          label="Needs Attention"
          style={{
            backgroundColor: theme.palette.warning.ultralight,
            color: theme.palette.warning.main
          }}
        />
      )

    case 'Declined':
      return (
        <Chip
          size="small"
          label="Declined"
          style={{
            backgroundColor: theme.palette.error.ultralight,
            color: theme.palette.error.main
          }}
        />
      )

    case 'Approved':
      return (
        <Chip
          size="small"
          label="Approved"
          style={{
            backgroundColor: theme.palette.success.ultralight,
            color: theme.palette.success.main
          }}
        />
      )

    case 'Required':
      return (
        <Chip
          size="small"
          label="Required"
          style={{
            backgroundColor: theme.palette.error.ultralight,
            color: theme.palette.error.main
          }}
        />
      )

    default:
      return null
  }
}
