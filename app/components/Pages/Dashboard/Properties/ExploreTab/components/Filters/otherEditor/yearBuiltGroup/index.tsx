import { Grid, Typography, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

import { EditorGroup } from '../EditorGroup'
import { createYearArray } from '../helpers'

export const YearBuiltGroup = () => {
  return (
    <EditorGroup title="Year Built">
      <Grid container alignItems="center" wrap="nowrap">
        <Grid item>
          <Autocomplete
            size="small"
            value={null}
            options={createYearArray()}
            getOptionLabel={option => (option ? option.toString() : 'Any')}
            // TODO remove this inline style
            style={{ width: 142 }}
            renderInput={params => (
              <TextField {...params} label="Min" variant="outlined" />
            )}
          />
        </Grid>
        <Grid item>
          <Typography style={{ padding: 8 }} variant="body1">
            To
          </Typography>
        </Grid>
        <Grid item>
          <Autocomplete
            size="small"
            value={null}
            options={createYearArray()}
            getOptionLabel={option => (option ? option.toString() : 'Any')}
            // TODO remove this inline style
            style={{ width: 142 }}
            renderInput={params => (
              <TextField {...params} label="Max" variant="outlined" />
            )}
          />
        </Grid>
      </Grid>
    </EditorGroup>
  )
}
