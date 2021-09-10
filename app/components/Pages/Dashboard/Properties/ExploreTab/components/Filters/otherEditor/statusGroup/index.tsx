import { FormControlLabel, Switch, Grid, Typography } from '@material-ui/core'
import CircleIcon from '@material-ui/icons/FiberManualRecord'

import { getStatusColorClass } from '@app/utils/listing'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

export const StatusGroup = () => {
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
            name="sold"
            inputProps={{ 'aria-label': 'sold checkbox' }}
          />
        }
        label={
          <Grid container alignItems="center">
            <CircleIcon
              className={classes.switchIcon}
              style={{ color: getStatusColorClass('Sold') }}
            />
            <Typography variant="body1">Sold</Typography>
          </Grid>
        }
      />
      <FormControlLabel
        classes={{
          root: classes.switchControlLabel
        }}
        control={
          <Switch
            className={classes.switchControlButton}
            color="primary"
            name="active"
            inputProps={{ 'aria-label': 'active checkbox' }}
          />
        }
        label={
          <Grid container alignItems="center">
            <CircleIcon
              className={classes.switchIcon}
              style={{ color: getStatusColorClass('Active') }}
            />
            <Typography variant="body1">Active</Typography>
          </Grid>
        }
      />
      <FormControlLabel
        classes={{
          root: classes.switchControlLabel
        }}
        control={
          <Switch
            className={classes.switchControlButton}
            color="primary"
            name="pending"
            inputProps={{ 'aria-label': 'Pending checkbox' }}
          />
        }
        label={
          <Grid container alignItems="center">
            <CircleIcon
              className={classes.switchIcon}
              style={{ color: getStatusColorClass('Pending') }}
            />
            <Typography variant="body1">Pending</Typography>
          </Grid>
        }
      />
      <FormControlLabel
        classes={{
          root: classes.switchControlLabel
        }}
        control={
          <Switch
            className={classes.switchControlButton}
            color="primary"
            name="other"
            inputProps={{ 'aria-label': 'Other checkbox' }}
          />
        }
        label={
          <Grid container alignItems="center">
            <CircleIcon
              className={classes.switchIcon}
              style={{ color: getStatusColorClass('Withdrawn') }}
            />
            <Typography variant="body1">Other Listing Statuses</Typography>
          </Grid>
        }
      />
    </EditorGroup>
  )
}
