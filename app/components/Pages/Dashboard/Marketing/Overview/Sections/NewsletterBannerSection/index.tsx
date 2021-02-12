import React from 'react'
import { Grid, Typography, Theme, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      backgroundColor: theme.palette.warning.light
    }
  }),
  {
    name: 'MarketingNewsletterBannerSection'
  }
)

export default function NewsletterBannerSection() {
  const classes = useStyles()

  return (
    <Grid
      container
      item
      direction="row"
      alignItems="center"
      justify="space-between"
      className={classes.container}
    >
      <Grid item>
        <Typography variant="h4">Make A Newsletter</Typography>
        <Typography variant="body1">
          Using our powerful yet easy to use block editor.
        </Typography>
      </Grid>
      <Grid item>
        <img
          alt="newsletter"
          src="/static/images/marketing/overview/newsletter-banner.png"
        />
      </Grid>
    </Grid>
  )
}
