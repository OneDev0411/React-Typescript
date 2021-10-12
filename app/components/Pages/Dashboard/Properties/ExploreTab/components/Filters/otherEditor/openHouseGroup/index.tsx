import { FormControlLabel, Switch, Grid, Typography } from '@material-ui/core'
import { mdiDoorOpen } from '@mdi/js'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

export const OpenHouseGroup = ({
  filters,
  updateFilters
}: Omit<FilterButtonDropDownProp<AlertFilters>, 'resultsCount'>) => {
  const classes = useStyles()

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({
      open_house: event.target.checked
    })
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
            onChange={handleValueChange}
            checked={!!filters.open_house}
            color="primary"
            name="open_house"
            inputProps={{ 'aria-label': 'open_house checkbox' }}
          />
        }
        label={
          <Grid container alignItems="center">
            <SvgIcon path={mdiDoorOpen} className={classes.switchIcon} />
            <Typography variant="body1">Open House Only</Typography>
          </Grid>
        }
      />
    </EditorGroup>
  )
}
