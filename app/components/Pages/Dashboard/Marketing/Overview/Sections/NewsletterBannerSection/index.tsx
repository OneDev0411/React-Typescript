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
      margin: theme.spacing(1, 1, 8),
      padding: theme.spacing(0, 4)
    },
    image: {
      maxWidth: '90%'
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
      spacing={4}
      className={classes.container}
    >
      <Grid item xs={12} sm={6}>
        <img
          alt="newsletter"
          src="/static/images/marketing/overview/marketing.png"
          className={classes.image}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="h4">Make beautiful emails with blocks.</Typography>
        <Box pt={1}>
          <Typography variant="body1">
            Drag and drop any article, videos, your listings and much more, to
            make engaging email content for your audience.
          </Typography>
        </Box>
        <Box pt={2}>
          <Link noStyle to="/dashboard/marketing/Newsletter">
            <Button color="primary" size="large" variant="outlined">
              Start Here
            </Button>
          </Link>
        </Box>
      </Grid>
    </Grid>
  )
}
