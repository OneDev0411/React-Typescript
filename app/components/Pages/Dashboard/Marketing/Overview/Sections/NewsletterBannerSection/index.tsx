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
      margin: theme.spacing(4, 1),
      padding: theme.spacing(0, 4)
    },
    image: {
      width: '100%',
      borderRadius: theme.shape.borderRadius
    },
    title: {
      color: theme.palette.common.white
    },
    subtitle: {
      color: theme.palette.warning.ultralight
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
      direction="row"
      className={classes.container}
    >
      <Grid item xs={8}>
        <img
          alt="newsletter"
          src="/static/images/marketing/overview/newsletter.png"
        />
      </Grid>
      <Grid item xs={4}>
        <Box pl={6}>
          <Typography variant="h4" className={classes.title}>
            Make A Newsletter
          </Typography>
          <Typography variant="h5" className={classes.subtitle}>
            Using our powerful yet easy to use block editor.
          </Typography>
          <Box pt={2}>
            <Link noStyle to="/dashboard/marketing/Newsletter">
              <Button color="primary" variant="outlined">
                Start Here
              </Button>
            </Link>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}
