import React from 'react'
import { Theme, Paper, Grid, Button, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import { mdiPlusCircleOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

const useStyles = makeStyles(
  (theme: Theme) => ({
    paper: {
      padding: 0,
      margin: theme.spacing(0, 0, 1.5, 0)
    },
    button: {
      padding: theme.spacing(1.25, 2),
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    },
    buttonLabel: {
      paddingRight: theme.spacing(0.75)
    },
    descriptionContainer: {
      position: 'relative',
      overflow: 'hidden'
    },
    description: {
      position: 'absolute',
      top: '50%',
      transform: 'translate(0, -50%)'
    }
  }),
  { name: 'CtaBar' }
)

interface Props {
  label: string
  description: string
  onClick?: () => void
}

export default function CtaBar({ label, description, onClick }: Props) {
  const classes = useStyles()
  const theme = useTheme<Theme>()

  return (
    <Paper variant="outlined" classes={{ root: classes.paper }}>
      <Grid container>
        <Grid item xs={4}>
          {/* TODO: It could be `fullWidth` or even fill the entire bar, check with product team. */}
          <Button
            variant="text"
            color="primary"
            onClick={onClick}
            classes={{ root: classes.button, label: classes.buttonLabel }}
          >
            <SvgIcon
              path={mdiPlusCircleOutline}
              size={muiIconSizes.large}
              color={theme.palette.primary.main}
              rightMargined
            />
            <Typography variant="subtitle2">{label}</Typography>
          </Button>
        </Grid>
        <Grid item xs={8} classes={{ root: classes.descriptionContainer }}>
          <Typography variant="body2" classes={{ root: classes.description }}>
            {description}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}
