import moment from 'moment'
import { Box, Tooltip, makeStyles, Theme, useTheme } from '@material-ui/core'
import { mdiCheckDecagram, mdiAlertCircle, mdiCloseCircle } from '@mdi/js'
import cn from 'classnames'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

const useStyles = makeStyles(
  (theme: Theme) => ({
    required: {
      color: theme.palette.error.light,
      ...theme.typography.subtitle3,
      lineHeight: 1,
      marginRight: theme.spacing(1)
    },
    status: {
      ...theme.typography.subtitle3,
      lineHeight: 1,
      marginRight: theme.spacing(1),
      '&.Incomplete': {
        display: 'none'
      },
      '&.Pending, &.Attention, &.Submitted, &.Notified': {
        color: '#f6a623'
      },
      '&.Declined': {
        color: '#d0011b'
      },
      '&.Approved': {
        color: '#35b863'
      }
    }
  }),
  {
    name: 'Deals-Checklists-Task-Label'
  }
)

interface Props {
  deal: IDeal
  task: IDealTask
  isBackOffice: boolean
}

export function TaskStatus({ deal, task, isBackOffice }: Props) {
  const classes = useStyles()
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

  const isRequired = status !== 'Approved' && task.required

  if (!status && !isRequired) {
    return null
  }

  const icon = getIcon(status, theme)

  return (
    <Box display="flex" alignItems="center">
      {isRequired && <div className={classes.required}>Required</div>}

      {status && !icon && (
        <div className={cn(classes.status, status)}>{status}</div>
      )}

      {status && icon && (
        <Tooltip title={tooltip} placement="bottom">
          <div style={{ lineHeight: 0 }}>{icon}</div>
        </Tooltip>
      )}
    </Box>
  )
}

function getIcon(status: string, theme: Theme) {
  switch (status) {
    case 'Pending':
    case 'Submitted':
    case 'Notified':
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
          color={theme.palette.primary.main}
          path={mdiCheckDecagram}
          size={muiIconSizes.medium}
        />
      )

    default:
      return null
  }
}
