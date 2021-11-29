import { makeStyles } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import SuperCampaignBaseCard from './SuperCampaignBaseCard'

const useStyles = makeStyles(
  theme => ({
    wrapper: { padding: theme.spacing(2) },
    text: { marginBottom: theme.spacing(1) },
    footer: { marginTop: theme.spacing(1) }
  }),
  { name: 'SuperCampaignWithEnrollmentSkeletonCard' }
)

function SuperCampaignWithEnrollmentSkeletonCard() {
  const classes = useStyles()

  return (
    <SuperCampaignBaseCard
      image={<Skeleton animation="wave" variant="rect" height="100%" />}
    >
      <div className={classes.wrapper}>
        <Skeleton
          className={classes.text}
          variant="text"
          animation="wave"
          height="15px"
          width="30%"
        />
        <Skeleton variant="text" animation="wave" height="19px" width="50%" />
        <div className={classes.footer}>
          <Skeleton
            className={classes.text}
            variant="text"
            animation="wave"
            height="10px"
          />
          <Skeleton
            className={classes.text}
            variant="text"
            animation="wave"
            height="10px"
          />
          <Skeleton
            className={classes.text}
            variant="text"
            animation="wave"
            height="10px"
          />
          <Skeleton variant="text" animation="wave" height="10px" />
        </div>
      </div>
    </SuperCampaignBaseCard>
  )
}

export default SuperCampaignWithEnrollmentSkeletonCard
