import { Grid, Typography, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'
import { createYearArray } from '../helpers'

export const YearBuiltGroup = () => {
  const classes = useStyles()

  return (
    <EditorGroup title="Year Built">
      <Grid container alignItems="center" wrap="nowrap">
        <Grid item className={classes.filledAutoCompleteWrapper}>
          <Autocomplete
            size="small"
            value={null}
            options={createYearArray()}
            getOptionLabel={option => (option ? option.toString() : 'Any')}
            renderInput={params => (
              <TextField {...params} label="Min" variant="outlined" />
            )}
          />
        </Grid>
        <Grid item className={classes.to}>
          <Typography variant="body1">To</Typography>
        </Grid>
        <Grid item className={classes.filledAutoCompleteWrapper}>
          <Autocomplete
            size="small"
            value={null}
            options={createYearArray()}
            getOptionLabel={option => (option ? option.toString() : 'Any')}
            renderInput={params => (
              <TextField {...params} label="Max" variant="outlined" />
            )}
          />
        </Grid>
      </Grid>
    </EditorGroup>
  )
}
