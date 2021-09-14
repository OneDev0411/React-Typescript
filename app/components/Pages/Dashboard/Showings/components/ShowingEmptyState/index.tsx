import { ReactNode } from 'react'

import { Grid, Box, Typography, Theme, makeStyles } from '@material-ui/core'

import LinkButton from '../LinkButton'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      margin: theme.spacing(9, 'auto', 8),
      padding: theme.spacing(0, 4),
      color: theme.palette.grey[800],
      maxWidth: theme.spacing(103)
    },
    image: {
      maxWidth: '90%'
    },
    button: { minWidth: theme.spacing(23) }
  }),
  {
    name: 'ShowingEmptyState'
  }
)

interface ShowingEmptyStateProps {
  title: string
  description?: ReactNode
  buttonLabel?: string
  buttonLink?: string
  buttonTarget?: string
}

export default function ShowingEmptyState({
  title,
  description,
  buttonLabel = 'Create Showing',
  buttonLink = '/dashboard/showings/create',
  buttonTarget
}: ShowingEmptyStateProps) {
  const classes = useStyles()

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-around"
      direction="row"
      spacing={4}
      className={classes.container}
    >
      <Grid item xs={12} sm={6}>
        <img
          alt="showing"
          src="/static/images/showings/showing.png"
          className={classes.image}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="h4">{title}</Typography>
        <Box pt={1}>
          <Typography variant="body1">{description}</Typography>
        </Box>
        <Box pt={2}>
          <LinkButton
            color="primary"
            size="large"
            variant="contained"
            className={classes.button}
            to={buttonLink}
            target={buttonTarget}
          >
            {buttonLabel}
          </LinkButton>
        </Box>
      </Grid>
    </Grid>
  )
}
