import React from 'react'
import {
  Grid,
  Box,
  Typography,
  Theme,
  makeStyles,
  Button
} from '@material-ui/core'

import Link from 'components/ALink'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      backgroundColor: theme.palette.tertiary.main,
      borderRadius: theme.shape.borderRadius,
      margin: theme.spacing(1, 1, 8),
      padding: theme.spacing(0, 4)
    },
    title: {
      color: theme.palette.common.white
    },
    subtitle: {
      color: theme.palette.warning.ultralight
    },
    image: {
      maxWidth: '100%'
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
      alignItems="center"
      justify="space-around"
      direction="row"
      className={classes.container}
    >
      <Grid item xs={8}>
        <img
          alt="newsletter"
          src="/static/images/marketing/overview/newsletter.png"
          className={classes.image}
        />
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h4" className={classes.title}>
          Make A Newsletter
        </Typography>
        <Typography variant="h5" className={classes.subtitle}>
          Using our powerful yet easy to use block editor.
        </Typography>
        <Box pt={2}>
          <Link noStyle to="/dashboard/marketing/Newsletter">
            <Button color="primary" size="large" variant="contained">
              Start Here
            </Button>
          </Link>
        </Box>
      </Grid>
    </Grid>
  )
}
