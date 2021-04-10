import { useState } from 'react'

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
  Checkbox,
  FormControlLabel
} from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { mdiClose } from '@mdi/js'

import { selectUser } from 'selectors/user'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import {
  createPropertyType,
  PropertyTypeData
} from 'models/property-types/create-property-type'
import { getActiveTeamId } from 'utils/user-teams'

interface Props {
  isOpen: boolean
  onCreate: () => void
  onClose: () => void
}

export function PropertyTypeForm({ isOpen, onClose, onCreate }: Props) {
  const [isSaving, setIsSaving] = useState(false)
  const user = useSelector(selectUser)

  const { control } = useForm()

  const handleClose = () => {
    onClose()
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const data = control.getValues() as PropertyTypeData

      await createPropertyType(getActiveTeamId(user)!, data)

      onCreate()
    } catch (e) {
      console.log(e)
    }

    setIsSaving(false)
  }

  return (
    <Dialog open={isOpen} fullWidth maxWidth="sm" onClose={handleClose}>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          Add New Property Type
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
            <Controller
              name="label"
              control={control}
              render={({ onChange, value }) => (
                <TextField
                  fullWidth
                  label="Property Name"
                  variant="outlined"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="is_lease"
              control={control}
              render={({ onChange, value = false }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value}
                      onChange={e => onChange(e.target.checked)}
                    />
                  }
                  label="Lease Property"
                />
              )}
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
