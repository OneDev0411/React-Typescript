import { ReactNode } from 'react'

import { Grid, Box, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    container: {
      height: '100%',
      display: 'flex',
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(1.5, 3),
      border: `1px solid ${theme.palette.action.disabledBackground}`,
      transition: theme.transitions.create('background-color'),

      '&:hover': {
        backgroundColor: theme.palette.action.hover
      }
    }
  }),
  {
    name: 'MarketingButton'
  }
)

interface Props {
  title: string
  subtitle?: string
  icon: ReactNode
}

export default function MarketingButton({ title, subtitle, icon }: Props) {
  const classes = useStyles()

  return (
    <Box className={classes.container}>
      <Grid container alignItems="center">
        <Grid container item xs={2}>
          {icon}
        </Grid>
        <Grid container item xs={10} direction="column">
          <Grid item>
            <Typography variant="subtitle2">{title}</Typography>
          </Grid>
          {subtitle && (
            <Grid item>
              <Typography variant="caption" color="textSecondary">
                {subtitle}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}
