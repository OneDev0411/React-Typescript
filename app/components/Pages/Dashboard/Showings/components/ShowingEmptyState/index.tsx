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
      margin: theme.spacing(9, 'auto', 8),
      padding: theme.spacing(0, 4),
      color: '#0F3057', // TODO: Ask this later from designers
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
}

export default function ShowingEmptyState({ title }: ShowingEmptyStateProps) {
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
          alt="showing"
          src="/static/images/showings/showing.png"
          className={classes.image}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="h4">{title}</Typography>
        <Box pt={1}>
          <Typography variant="body1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque mi est egestas cursus arcu massa. Tellus eu, aenean
            feugiat sed nulla imperdiet sapien, eget.
          </Typography>
        </Box>
        <Box pt={2}>
          <Link noStyle to="/dashboard/showings/create">
            <Button
              color="primary"
              size="large"
              variant="contained"
              className={classes.button}
            >
              Create Showing
            </Button>
          </Link>
        </Box>
      </Grid>
    </Grid>
  )
}
