import React from 'react'
import { Grid, Theme, makeStyles } from '@material-ui/core'

import Link from 'components/ALink'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '100%',
      marginBottom: theme.spacing(4)
    },
    image: {
      width: '100%',
      borderRadius: theme.shape.borderRadius
    }
  }),
  {
    name: 'MarketingNewsletterBannerSection'
  }
)

export default function NewsletterBannerSection() {
  const classes = useStyles()

  return (
    <Grid item className={classes.container}>
      <Link noStyle to="/dashboard/marketing/Newsletter">
        <img
          alt="newsletter"
          src="/static/images/marketing/overview/newsletter-banner.png"
          className={classes.image}
        />
      </Link>
    </Grid>
  )
}
