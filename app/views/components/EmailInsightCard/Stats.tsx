import React from 'react'
import { Grid, Typography, Tooltip, Theme, makeStyles } from '@material-ui/core'
import {
  mdiAccountMultipleOutline,
  mdiCheckAll,
  mdiEyeOutline,
  mdiCursorDefaultClickOutline
} from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    statValue: {
      ...theme.typography.body3
    }
  }),
  {
    name: 'EmailInsightCardStats'
  }
)

interface Props {
  campaign: IEmailCampaign
}

export default function Stats({ campaign }: Props) {
  const classes = useStyles()

  return (
    <Grid container direction="row" justify="space-between" wrap="nowrap">
      <Grid container item direction="column" alignItems="center">
        <Grid item>
          <Tooltip placement="top" title="Sent">
            <span>
              <SvgIcon path={mdiAccountMultipleOutline} />
            </span>
          </Tooltip>
        </Grid>
        <Grid item>
          <Typography className={classes.statValue}>{campaign.sent}</Typography>
        </Grid>
      </Grid>
      <Grid container item direction="column" alignItems="center">
        <Grid item>
          <Tooltip placement="top" title="Delivered">
            <span>
              <SvgIcon path={mdiCheckAll} />
            </span>
          </Tooltip>
        </Grid>
        <Grid item>
          <Typography className={classes.statValue}>
            {campaign.delivered}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item direction="column" alignItems="center">
        <Grid item>
          <Tooltip placement="top" title="Opened">
            <span>
              <SvgIcon path={mdiEyeOutline} />
            </span>
          </Tooltip>
        </Grid>
        <Grid item>
          <Typography className={classes.statValue}>
            {campaign.opened}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item direction="column" alignItems="center">
        <Grid item>
          <Tooltip placement="top" title="Clicked">
            <span>
              <SvgIcon path={mdiCursorDefaultClickOutline} />
            </span>
          </Tooltip>
        </Grid>
        <Grid item>
          <Typography className={classes.statValue}>
            {campaign.clicked}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}
