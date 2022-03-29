import { Button, IconButton, makeStyles } from '@material-ui/core'
import { mdiTrashCanOutline, mdiOpenInNew } from '@mdi/js'

import { useDeleteSocialPost } from '@app/models/social-posts'
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
      // TODO: Remove this style when the bootstrap css got removed.
      '&:hover': {
        color: theme.palette.primary.main
      }
    },
    deleteButton: { marginLeft: theme.spacing(1) }
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

  const { mutate, isLoading: isDeleting } = useDeleteSocialPost()

  const handleDelete = () => mutate(socialPost)

  const isWorking = isDeleting

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
            <Button
              color="primary"
              size="small"
              onClick={handleOpen}
              disabled={isWorking}
            >
              Reschedule
            </Button>
          )}
        </DateTimePicker>
        <IconButton
          className={classes.deleteButton}
          size="small"
          onClick={handleDelete}
          disabled={isWorking}
        >
          <SvgIcon path={mdiTrashCanOutline} size={muiIconSizes.medium} />
        </IconButton>
      </div>
    )
  }

  return null
}

export default SocialPostTableColumnActions
