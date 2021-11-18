import { CardMedia, makeStyles, Typography } from '@material-ui/core'
import { Link } from 'react-router'

import { ACL } from '@app/constants/acl'
import { useAcl } from '@app/views/components/Acl/use-acl'

import SuperCampaignBaseCard, {
  SuperCampaignBaseCardProps
} from './SuperCampaignBaseCard'
import SuperCampaignCardDays from './SuperCampaignCardDays'

const useStyles = makeStyles(
  theme => ({
    '@keyframes scrollPositionAnimation': {
      from: {
        objectPosition: '0 0%'
      },
      to: {
        objectPosition: '0 100%'
      }
    },
    media: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: '0 0',
      background: theme.palette.grey[100],
      '&:hover': {
        animation: '8s linear infinite alternate $scrollPositionAnimation'
      }
    },
    description: {
      color: theme.palette.grey[700],
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      '-webkit-line-clamp': 2 /* number of lines to show */,
      'line-clamp': 2,
      '-webkit-box-orient': 'vertical'
    },
    margin: {
      display: 'block',
      marginBottom: theme.spacing(0.5)
    },
    padding: { padding: theme.spacing(2) }
  }),
  { name: 'SuperCampaignCard' }
)

export interface SuperCampaignCardProps
  extends Omit<SuperCampaignBaseCardProps, 'image'> {
  superCampaign: ISuperCampaign<'template_instance'>
}

function SuperCampaignCard({
  superCampaign,
  children,
  ...otherProps
}: SuperCampaignCardProps) {
  const classes = useStyles()

  const title = (
    <Typography className={classes.margin} variant="subtitle2" noWrap>
      {superCampaign.subject || 'Untitled Campaign'}
    </Typography>
  )

  const isAdmin = useAcl(ACL.ADMIN)

  return (
    <SuperCampaignBaseCard
      {...otherProps}
      image={
        <CardMedia
          component="img"
          className={classes.media}
          src={
            superCampaign.template_instance?.file.preview_url ??
            '/static/images/logo--gray.svg'
          }
        />
      }
    >
      <div className={classes.padding}>
        {superCampaign.due_at && (
          <SuperCampaignCardDays
            className={classes.margin}
            time={superCampaign.due_at}
          />
        )}
        {isAdmin ? (
          <Link
            to={`/dashboard/insights/super-campaign/${superCampaign.id}/detail`}
          >
            {title}
          </Link>
        ) : (
          title
        )}
        <Typography variant="body2" className={classes.description}>
          {superCampaign.description}
        </Typography>
      </div>
      {children}
    </SuperCampaignBaseCard>
  )
}

export default SuperCampaignCard
