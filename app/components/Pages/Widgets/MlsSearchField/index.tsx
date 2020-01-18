import React from 'react'
import TextField from '@material-ui/core/TextField'

import MLSSearch from '../MlsSearchAutocomplete'

export default function Search() {
  return (
    <MLSSearch id="standard_search">
      <TextField
        id="standard_search"
        type="text"
        placeholder="Search here ..."
      />
    </MLSSearch>
  )
}
