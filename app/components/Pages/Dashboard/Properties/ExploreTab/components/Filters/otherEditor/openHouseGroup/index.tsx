import { FormControlLabel, Switch, Grid, Typography } from '@material-ui/core'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

export const OpenHouseGroup = () => {
  const classes = useStyles()

  return (
    <EditorGroup>
      <FormControlLabel
        classes={{
          root: classes.switchControlLabel
        }}
        control={
          <Switch
            className={classes.switchControlButton}
            color="primary"
            name="open_house"
            inputProps={{ 'aria-label': 'open_house checkbox' }}
          />
        }
        label={
          <Grid container alignItems="center">
            <MeetingRoomIcon className={classes.switchIcon} />
            <Typography variant="body1">Open House Only</Typography>
          </Grid>
        }
      />
    </EditorGroup>
  )
}
