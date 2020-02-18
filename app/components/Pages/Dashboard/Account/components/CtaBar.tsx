import React from 'react'
import { Theme, Paper, Grid, Button, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'

import IconAddCircleOutline from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

const useStyles = makeStyles(
  (theme: Theme) => ({
    paper: {
      padding: 0
    },
    button: {
      padding: theme.spacing(1.25, 2),
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    },
    buttonLabel: {
      lineHeight: '8px',
      paddingRight: theme.spacing(0.75)
    },
    buttonIcon: {
      marginRight: theme.spacing(2)
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
          <Button
            variant="text"
            color="primary"
            // fullWidth
            onClick={onClick}
            classes={{ root: classes.button, label: classes.buttonLabel }}
          >
            <IconAddCircleOutline
              size={{ width: 38, height: 38 }}
              fillColor={theme.palette.primary.main}
              className={classes.buttonIcon}
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
