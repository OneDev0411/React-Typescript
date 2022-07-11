import { Typography, makeStyles, Tooltip } from '@material-ui/core'
import isBefore from 'date-fns/isBefore'

import { useUser } from '@app/hooks/use-user'
import { Thumbnail } from '@app/views/components/MarketingTemplateCard/Thumbnail'
import RelativeSendTime from '@app/views/components/RelativeSendTime'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      maxWidth: '100%'
    },
    image: {
      width: theme.spacing(5),
      height: theme.spacing(5),
      overflow: 'hidden',
      borderRadius: theme.shape.borderRadius,
      marginRight: theme.spacing(4),
      flexShrink: 0,
      flexGrow: 0
    },
    details: {
      flexShrink: 1,
      flexGrow: 1,
      overflow: 'hidden',
      marginRight: theme.spacing(1)
    },
    date: { color: theme.palette.grey[500] }
  }),
  { name: 'SocialPostTableColumnPost' }
)

interface SocialPostTableColumnPostProps {
  socialPost: ISocialPost<'template_instance' | 'owner'>
}

function SocialPostTableColumnPost({
  socialPost
}: SocialPostTableColumnPostProps) {
  const classes = useStyles()
  const user = useUser()

  const isPast = isBefore(socialPost.due_at * 1000, new Date())

  return (
    <div className={classes.root}>
      <div className={classes.image}>
        <Thumbnail
          user={user}
          template={socialPost.template_instance}
          useStaticImage
        />
      </div>
      <div className={classes.details}>
        <Tooltip title={socialPost.caption}>
          <Typography variant="body2" component="div" noWrap>
            {socialPost.caption}
          </Typography>
        </Tooltip>
        <Typography
          className={classes.date}
          variant="body2"
          component="div"
          noWrap
        >
          <RelativeSendTime
            prefix={isPast ? 'Sent ' : 'Scheduled '}
            time={socialPost.due_at}
          />
        </Typography>
      </div>
    </div>
  )
}

export default SocialPostTableColumnPost
