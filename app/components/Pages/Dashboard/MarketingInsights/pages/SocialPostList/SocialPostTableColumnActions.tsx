import { Button, IconButton, makeStyles } from '@material-ui/core'
import { mdiTrashCanOutline, mdiOpenInNew } from '@mdi/js'

import { convertTimestampToDate } from '@app/utils/date-utils'
import { futureTimeValidator } from '@app/utils/validations/future-time'
import { DateTimePicker } from '@app/views/components/DateTimePicker'
import LinkButton from '@app/views/components/LinkButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'inline-flex',
      alignItems: 'center'
    },
    viewButton: {
      '&:hover': {
        color: theme.palette.primary.main
      }
    }
  }),
  { name: 'SocialPostTableColumnActions' }
)

interface SocialPostTableColumnActionsProps {
  socialPost: ISocialPost<'template_instance' | 'owner'>
}

function SocialPostTableColumnActions({
  socialPost
}: SocialPostTableColumnActionsProps) {
  const classes = useStyles()

  if (socialPost.post_link) {
    return (
      <LinkButton
        className={classes.viewButton}
        color="primary"
        size="small"
        to={socialPost.post_link}
        target="_blank"
        endIcon={<SvgIcon path={mdiOpenInNew} size={muiIconSizes.small} />}
      >
        View on Instagram
      </LinkButton>
    )
  }

  if (!socialPost.executed_at) {
    const selectedDate = convertTimestampToDate(socialPost.due_at)

    return (
      <div className={classes.root}>
        <DateTimePicker
          onClose={date => console.log('date', date)}
          showTimePicker
          selectedDate={selectedDate}
          defaultSelectedDate={selectedDate}
          datePickerModifiers={{
            disabled: {
              before: new Date()
            }
          }}
          validate={futureTimeValidator}
        >
          {({ handleOpen }) => (
            <Button color="primary" size="small" onClick={handleOpen}>
              Reschedule
            </Button>
          )}
        </DateTimePicker>
        <IconButton>
          <SvgIcon path={mdiTrashCanOutline} size={muiIconSizes.medium} />
        </IconButton>
      </div>
    )
  }

  return null
}

export default SocialPostTableColumnActions
