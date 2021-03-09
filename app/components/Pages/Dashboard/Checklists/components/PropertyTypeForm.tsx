import React, { useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel
} from '@material-ui/core'

import { mdiClose } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

export function PropertyTypeForm() {
  const [isSaving, setIsSaving] = useState(false)

  const handleClose = () => {}

  const handleSave = () => {
    setIsSaving(true)
  }

  return (
    <Dialog open fullWidth maxWidth="sm" onClose={handleClose}>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          Add New Property Type{' '}
          <IconButton onClick={handleClose}>
            <SvgIcon path={mdiClose} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid
          container
          style={{
            flexGrow: 1
          }}
          spacing={2}
        >
          <Grid item xs={12}>
            <TextField label="Property Name" variant="outlined" fullWidth />
          </Grid>

          <Grid item xs={12}>
            <Select
              value="Selling"
              fullWidth
              variant="outlined"
              onChange={() => {}}
            >
              <MenuItem value="Selling">Listing</MenuItem>
              <MenuItem value="Buying">Contract</MenuItem>
              <MenuItem value="Offer">Offer</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox checked={false} onChange={() => {}} name="is_lease" />
              }
              label="Lease Property"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          disabled={isSaving}
          onClick={handleSave}
        >
          {isSaving ? 'Saving...' : 'Save Property'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
