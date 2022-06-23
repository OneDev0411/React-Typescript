import { Typography, makeStyles } from '@material-ui/core'
import isBefore from 'date-fns/isBefore'

import RelativeSendTime from '@app/views/components/RelativeSendTime'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
    date: {
      color: theme.palette.grey[500],
      textDecoration: 'none'
    }
  }),
  {
    name: 'SuperCampaignListColumnSubject'
  }
)

interface SuperCampaignListColumnSubjectProps {
  subject: Optional<string>
  dueAt: Nullable<number>
}

function SuperCampaignListColumnSubject({
  subject,
  dueAt
}: SuperCampaignListColumnSubjectProps) {
  const classes = useStyles()

  const isPast = !!dueAt && isBefore(dueAt * 1000, new Date())

  return (
    <div className={classes.root}>
      <Typography variant="body1" noWrap>
        {subject || '(Untitled Campaign)'}
      </Typography>
      {dueAt && (
        <Typography className={classes.date} variant="body2">
          <RelativeSendTime prefix={isPast ? 'Sent ' : 'Send '} time={dueAt} />
        </Typography>
      )}
    </div>
  )
}

export default SuperCampaignListColumnSubject
