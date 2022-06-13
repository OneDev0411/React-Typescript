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

import { ReminderDialogBaseProps } from './types'

const useStyles = makeStyles(
  theme => ({
    saveButton: {
      padding: theme.spacing(1, 2)
    },
    popup: {
      zIndex: theme.zIndex.modal - 2
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
    },
    arrow: {
      overflow: 'hidden',
      position: 'absolute',
      width: 0,
      height: 0,
      top: 2,
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderBottom: '8px solid #fff'
    }
  }),
  { name: 'ReminderDialog' }
)

interface Props extends Omit<ReminderDialogBaseProps, 'userSettingsKey'> {
  open: boolean
  onClickGotIt: (dontShow: boolean) => void
}

export function ReminderPopper({
  open,
  anchorEl,
  title,
  arrow = true,
  placement = 'bottom-end',
  buttonText = 'Got it!',
  checkboxText = "Don't show me this message again",
  image = '/static/images/bell/bell.gif',
  onClickGotIt
}: Props) {
  const classes = useStyles()

  const [dontShow, setDontShow] = useState(false)
  const [arrowRef, setArrowRef] = useState<HTMLElement | null>(null)

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
          enabled: arrow,
          element: arrowRef
        }
      }}
    >
      {arrow ? <span className={classes.arrow} ref={setArrowRef} /> : null}
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
