import { Grid, TextField } from '@material-ui/core'

import { withRouter } from '@app/routes/with-router'

import SearchIcon from '../../../../views/components/SvgIcons/Search/IconSearch'
import MLSSearch from '../MlsSearchAutocomplete'

function Search() {
  return (
    <MLSSearch id="standard_search">
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
          <SearchIcon />
        </Grid>
        <Grid item>
          <TextField placeholder="Search here ..." id="standard_search" />
        </Grid>
      </Grid>
    </MLSSearch>
  )
}

export default withRouter(Search)
