import { useState } from 'react'

import {
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  Checkbox,
  FormGroup
} from '@material-ui/core'
import CircleIcon from '@material-ui/icons/FiberManualRecord'
import { mapValues } from 'lodash'

import {
  STATUSES,
  PENDING_STATUSES,
  OTHER_STATUSES
} from '@app/components/Pages/Dashboard/Properties/constants/constants'
import { getStatusColorClass } from '@app/utils/listing'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

export const StatusGroup = () => {
  const classes = useStyles()

  const [values, setValues] = useState<Record<keyof typeof STATUSES, boolean>>(
    mapValues(STATUSES, () => false)
  )

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({
      ...prev,
      [event.target.name]: event.target.checked
    }))
  }

  const [pendingValues, setPendingValues] = useState<
    Record<keyof typeof PENDING_STATUSES, boolean>
  >(mapValues(PENDING_STATUSES, () => false))

  const handlePendingValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPendingValues(prev => ({
      ...prev,
      [event.target.name]: event.target.checked
    }))
  }

  const [otherValues, setOtherValues] = useState<
    Record<keyof typeof OTHER_STATUSES, boolean>
  >(mapValues(OTHER_STATUSES, () => false))

  const handleOtherValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOtherValues(prev => ({
      ...prev,
      [event.target.name]: event.target.checked
    }))
  }

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
            onChange={handleValueChange}
            inputProps={{ 'aria-label': 'sold checkbox' }}
          />
        }
        label={
          <Grid container alignItems="center">
            <CircleIcon
              className={classes.switchIcon}
              style={{ color: getStatusColorClass('Sold') }}
            />
            <Typography variant="body1">{STATUSES.sold}</Typography>
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
            onChange={handleValueChange}
            inputProps={{ 'aria-label': 'active checkbox' }}
          />
        }
        label={
          <Grid container alignItems="center">
            <CircleIcon
              className={classes.switchIcon}
              style={{ color: getStatusColorClass('Active') }}
            />
            <Typography variant="body1">{STATUSES.active}</Typography>
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
            onChange={handleValueChange}
            inputProps={{ 'aria-label': 'Pending checkbox' }}
          />
        }
        label={
          <Grid container alignItems="center">
            <CircleIcon
              className={classes.switchIcon}
              style={{ color: getStatusColorClass('Pending') }}
            />
            <Typography variant="body1">{STATUSES.pending}</Typography>
          </Grid>
        }
      />
      {values.pending === true && (
        <FormGroup className={classes.subStatusGroup} row>
          {Object.keys(PENDING_STATUSES).map(key => (
            <Grid item key={key} xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={pendingValues[key]}
                    onChange={handlePendingValueChange}
                    name={key}
                  />
                }
                label={PENDING_STATUSES[key]}
              />
            </Grid>
          ))}
        </FormGroup>
      )}
      <FormControlLabel
        classes={{
          root: classes.switchControlLabel
        }}
        control={
          <Switch
            className={classes.switchControlButton}
            color="primary"
            name="other"
            onChange={handleValueChange}
            inputProps={{ 'aria-label': 'Other checkbox' }}
          />
        }
        label={
          <Grid container alignItems="center">
            <CircleIcon
              className={classes.switchIcon}
              style={{ color: getStatusColorClass('Withdrawn') }}
            />
            <Typography variant="body1">{STATUSES.other}</Typography>
          </Grid>
        }
      />
      {values.other === true && (
        <FormGroup className={classes.subStatusGroup} row>
          {Object.keys(OTHER_STATUSES).map(key => (
            <Grid item key={key} xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={otherValues[key]}
                    onChange={handleOtherValueChange}
                    name={key}
                  />
                }
                label={OTHER_STATUSES[key]}
              />
            </Grid>
          ))}
        </FormGroup>
      )}
    </EditorGroup>
  )
}
