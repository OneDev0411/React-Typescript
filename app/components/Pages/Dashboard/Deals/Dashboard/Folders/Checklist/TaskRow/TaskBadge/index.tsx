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
    <Box display="flex" ml={1}>
      <Box>
        <Tooltip title={tooltip || status} placement="left">
          <>{getBadge(status, theme)}</>
        </Tooltip>
      </Box>

      {task.acl.includes('Agents') === false && (
        <Box ml={1}>
          <Chip
            size="small"
            label="Private"
            style={{
              backgroundColor: theme.palette.grey[100],
              color: theme.palette.grey[700]
            }}
          />
        </Box>
      )}
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
          label="Office Notified"
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
          label="Office Declined"
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
          label="Office Approved"
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
