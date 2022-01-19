import { useState } from 'react'

import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  makeStyles,
  Paper,
  Popper,
  Typography
} from '@material-ui/core'

import { Props as ReminderDialogProps } from './index'

const useStyles = makeStyles(
  theme => ({
    saveButton: {
      padding: theme.spacing(1, 2)
    },
    popup: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
      zIndex: theme.zIndex.modal
    },
    container: {
      marginTop: theme.spacing(1),
      padding: theme.spacing(2),
      width: '450px'
    },
    icon: {
      width: '100%',
      display: 'inline-block'
    },
    title: {
      marginBottom: theme.spacing(2)
    },
    gotItButton: {
      marginTop: theme.spacing(1)
    }
  }),
  { name: 'ReminderDialog' }
)

interface Props extends Omit<ReminderDialogProps, 'userSettingsKey'> {
  open: boolean
  onClickGotIt: (dontShwo: boolean) => void
}

export function ReminderPopper({
  open,
  anchorEl,
  title,
  placement = 'bottom',
  buttonText = 'Got it!',
  checkboxText = "Don't show me this message again",
  image = '/static/images/bell/bell.gif',
  onClickGotIt
}: Props) {
  const classes = useStyles()
  const [dontShow, setDontShow] = useState(false)

  const handleDontShowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDontShow(event.target.checked)
  }

  return (
    <Popper
      open={open && !!anchorEl}
      anchorEl={anchorEl}
      placement={placement}
      className={classes.popup}
      modifiers={{
        arrow: {
          enabled: true
        }
      }}
    >
      <Paper elevation={4}>
        <Grid
          className={classes.container}
          container
          direction="row"
          spacing={3}
        >
          <Grid
            item
            xs={3}
            container
            justifyContent="center"
            alignItems="flex-start"
          >
            <img className={classes.icon} src={image} alt="reminder" />
          </Grid>
          <Grid item xs={9} container direction="column">
            <Typography className={classes.title} variant="h6">
              {title}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  color="primary"
                  checked={dontShow}
                  onChange={handleDontShowChange}
                  name="dont_show"
                />
              }
              label={checkboxText}
            />
            <Button
              className={classes.gotItButton}
              variant="contained"
              color="primary"
              size="medium"
              onClick={() => onClickGotIt(dontShow)}
            >
              {buttonText}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Popper>
  )
}
