import { Typography, makeStyles } from '@material-ui/core'

import SuperCampaignSendTime from '@app/views/components/SuperCampaignSendTime'

const useStyles = makeStyles(
  theme => ({
    date: { color: theme.palette.grey[500] }
  }),
  {
    name: 'SuperCampaignListColumnSubject'
  }
)

interface SuperCampaignListColumnSubjectProps {
  subject: Optional<string>
  dueAt: Optional<number>
}

function SuperCampaignListColumnSubject({
  subject,
  dueAt
}: SuperCampaignListColumnSubjectProps) {
  const classes = useStyles()

  return (
    <>
      <Typography variant="body1" noWrap>
        {subject || '(Untitled Campaign)'}
      </Typography>
      {dueAt && (
        <Typography className={classes.date} variant="body2">
          Send <SuperCampaignSendTime time={dueAt} />
        </Typography>
      )}
    </>
  )
}

export default SuperCampaignListColumnSubject
