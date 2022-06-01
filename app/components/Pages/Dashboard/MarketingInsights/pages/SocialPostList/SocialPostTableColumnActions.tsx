import { IconButton, makeStyles } from '@material-ui/core'
import { mdiTrashCanOutline, mdiOpenInNew } from '@mdi/js'
import { useSelector } from 'react-redux'

import { useDeleteSocialPost } from '@app/models/social-posts'
import { selectUserId } from '@app/selectors/user'
import LinkButton from '@app/views/components/LinkButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { isSocialPostExecuted, isSocialPostFailed } from './helpers'
import SocialPostFailedChip from './SocialPostFailedChip'
import SocialPostPreviewButton from './SocialPostPreviewButton'

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
    actionMargin: { marginLeft: theme.spacing(1) }
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

  const { mutate: silentDeleteSocialPost, isLoading: isSilentDeleting } =
    useDeleteSocialPost({ notify: { onSuccess: '', onError: '' } })

  const handleDelete = () => deleteSocialPost(socialPost)

  const handleSilentDelete = () => silentDeleteSocialPost(socialPost)

  const socialPostBelongsToCurrentUser =
    useSelector(selectUserId) === socialPost.owner.id

  const isWorking = isDeleting || isSilentDeleting

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

  const isFailed = isSocialPostFailed(socialPost)

  // If it is executed successfully, display nothing
  if (isSocialPostExecuted(socialPost) && !isFailed) {
    return null
  }

  // Otherwise, it is not executed yet and we need to have the reschedule/retry and delete buttons
  return (
    <div className={classes.root}>
      {isFailed && <SocialPostFailedChip />}
      {socialPostBelongsToCurrentUser && (
        <>
          <SocialPostPreviewButton
            className={classes.actionMargin}
            socialPost={socialPost}
            color="primary"
            size="small"
            disabled={isWorking}
            onSocialPostScheduledOrSent={handleSilentDelete}
          />
          <IconButton
            className={classes.actionMargin}
            size="small"
            onClick={handleDelete}
            disabled={isWorking}
          >
            <SvgIcon path={mdiTrashCanOutline} size={muiIconSizes.medium} />
          </IconButton>
        </>
      )}
    </div>
  )
}

export default SocialPostTableColumnActions
