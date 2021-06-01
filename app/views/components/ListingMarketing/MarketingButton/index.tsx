import { ReactNode } from 'react'
import { Grid, Box, Typography, makeStyles } from '@material-ui/core'

import Link from 'components/ALink'

const useStyles = makeStyles(
  theme => ({
    container: {
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
  url: string
}

export default function MarketingButton({ title, subtitle, icon, url }: Props) {
  const classes = useStyles()

  return (
    <Box className={classes.container}>
      <Link noStyle to={url}>
        <Grid container alignItems="center">
          <Grid item xs={2}>
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
      </Link>
    </Box>
  )
}
