import { CardMedia, makeStyles, Typography } from '@material-ui/core'

import SuperCampaignBaseCard, {
  SuperCampaignBaseCardProps
} from './SuperCampaignBaseCard'
import SuperCampaignCardDays from './SuperCampaignCardDays'

export interface SuperCampaignCardProps
  extends Omit<SuperCampaignBaseCardProps, 'image'> {
  superCampaign: ISuperCampaign<'template_instance' | 'created_by'>
  descriptionLineCount: number
}

const useStyles = makeStyles(
  theme => ({
    '@keyframes scrollPositionAnimation': {
      from: {
        objectPosition: 'center 0%'
      },
      to: {
        objectPosition: 'center 100%'
      }
    },
    media: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center 0',
      background: theme.palette.grey[100],
      '&:hover': {
        animation: '8s linear infinite alternate $scrollPositionAnimation'
      }
    },
    description: ({
      descriptionLineCount
    }: Pick<SuperCampaignCardProps, 'descriptionLineCount'>) => ({
      color: theme.palette.grey[700],
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      '-webkit-line-clamp': descriptionLineCount /* number of lines to show */,
      'line-clamp': descriptionLineCount,
      '-webkit-box-orient': 'vertical'
    }),
    margin: {
      display: 'block',
      marginBottom: theme.spacing(0.5)
    },
    padding: { padding: theme.spacing(2, 2, 0, 2) }
  }),
  { name: 'SuperCampaignCard' }
)

function SuperCampaignCard({
  superCampaign,
  children,
  descriptionLineCount,
  ...otherProps
}: SuperCampaignCardProps) {
  const classes = useStyles({ descriptionLineCount })

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
        <Typography variant="subtitle2" noWrap gutterBottom>
          {superCampaign.subject || 'Untitled Campaign'}
        </Typography>
        <Typography variant="body2" className={classes.description}>
          {superCampaign.description}
        </Typography>
      </div>
      {children}
    </SuperCampaignBaseCard>
  )
}

export default SuperCampaignCard
