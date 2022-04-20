import { Button, IconButton, makeStyles } from '@material-ui/core'
import { mdiTrashCanOutline, mdiOpenInNew } from '@mdi/js'

import {
  useDeleteSocialPost,
  useUpdateSocialPost
} from '@app/models/social-posts'
import {
  convertDateToTimestamp,
  convertTimestampToDate
} from '@app/utils/date-utils'
import { futureTimeValidator } from '@app/utils/validations/future-time'
import { DateTimePicker } from '@app/views/components/DateTimePicker'
import LinkButton from '@app/views/components/LinkButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { isSocialPostExecuted } from './helpers'

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

  const { mutate: deleteSocialPost, isLoading: isDeleting } =
    useDeleteSocialPost()
  const { mutate: updateSocialPost, isLoading: isUpdating } =
    useUpdateSocialPost()

  const handleDelete = () => deleteSocialPost(socialPost)

  const handleDueAtChange = (date: Date) =>
    updateSocialPost({
      socialPost,
      inputData: { due_at: convertDateToTimestamp(date) }
    })

  const isWorking = isDeleting || isUpdating

  // If it is already posted, it can display the post link
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

  // If it is executed, display nothing
  if (isSocialPostExecuted(socialPost)) {
    return null
  }

  const selectedDate = convertTimestampToDate(socialPost.due_at)

  // Otherwise, it is not executed yet and we need to have the reschedule and delete buttons
  return (
    <div className={classes.root}>
      <DateTimePicker
        onClose={handleDueAtChange}
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

export default SocialPostTableColumnActions
