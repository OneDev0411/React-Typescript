import { Box, Chip, makeStyles, Theme, Tooltip } from '@material-ui/core'

import ALink from '@app/views/components/ALink'
import { TextMiddleTruncate } from '@app/views/components/TextMiddleTruncate'
import { EditEmailButton } from 'components/EditEmailButton'

import { isEmailFailed } from '../../helpers/is-email-failed'
import { isEmailInProgress } from '../../helpers/is-email-in-progress'
import { isEmailScheduled } from '../../helpers/is-email-scheduled'

import { DateColumn } from './DateColumn'

const useStyles = makeStyles(
  (theme: Theme) => ({
    chipError: {
      backgroundColor: theme.palette.error.light,
      color: theme.palette.common.white
    },
    chipWarning: {
      backgroundColor: theme.palette.warning.light,
      color: theme.palette.common.white
    }
  }),
  {
    name: 'Insight-Table-TitleColumn'
  }
)

interface Props {
  item: IEmailCampaign<'template'>
  reload: () => void
}

export function TitleColumn({ item, reload }: Props) {
  const classes = useStyles()
  const isFailed = isEmailFailed(item)
  const isScheduled = isEmailScheduled(item)
  const isInProgress = isEmailInProgress(item)

  const title = (
    <Box pr={2} maxWidth="100%">
      <TextMiddleTruncate
        text={item.subject || '(untitled)'}
        maxLength={isScheduled ? 140 : 55}
      />
    </Box>
  )

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      maxWidth="100%"
    >
      {isScheduled || isInProgress ? (
        <EditEmailButton
          emailId={item.id}
          onEmailUpdated={reload}
          onDeleted={reload}
        >
          {({ onClick }) => <div onClick={onClick}>{title}</div>}
        </EditEmailButton>
      ) : (
        <ALink to={`/dashboard/insights/${item.id}`}>{title}</ALink>
      )}
      <Box display="flex" alignItems="center" mt={0.5}>
        <DateColumn item={item} />
        <Box ml={1}>
          {isFailed && (
            <Tooltip title={item.failure || ''}>
              <Chip size="small" label="Failed" className={classes.chipError} />
            </Tooltip>
          )}
        </Box>
        {isInProgress && (
          <Chip
            size="small"
            label="In Progress"
            className={classes.chipWarning}
          />
        )}
      </Box>
    </Box>
  )
}
