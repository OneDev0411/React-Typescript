import { useState } from 'react'

import { Grid, Box, TextField, IconButton } from '@material-ui/core'
import { mdiMagnify } from '@mdi/js'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

interface Props {
  onChange: (value: string) => void
}

export function RoleSearch({ onChange }: Props) {
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false)

  return (
    <Grid container>
      <Box width="100%" my={4}>
        {!isSearchBarOpen ? (
          <Box display="flex" alignItems="center">
            Roles{' '}
            <IconButton size="small" onClick={() => setIsSearchBarOpen(true)}>
              <SvgIcon color="gray" path={mdiMagnify} />
            </IconButton>
          </Box>
        ) : (
          <Box width="40%">
            <TextField
              fullWidth
              size="small"
              placeholder="Search Role..."
              onChange={e => onChange(e.target.value)}
            />
          </Box>
        )}
      </Box>
    </Grid>
  )
}
