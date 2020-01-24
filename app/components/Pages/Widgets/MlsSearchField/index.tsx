import React from 'react'
import { Grid, TextField } from '@material-ui/core'

import MLSSearch from '../MlsSearchAutocomplete'
import SearchIcon from '../../../../views/components/SvgIcons/Search/IconSearch'

export default function Search() {
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
