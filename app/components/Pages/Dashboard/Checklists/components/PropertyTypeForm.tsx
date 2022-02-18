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
import { mdiClose } from '@mdi/js'
import { useForm, Controller } from 'react-hook-form'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import {
  createPropertyType,
  PropertyTypeData
} from 'models/property-types/create-property-type'

interface Props {
  isOpen: boolean
  onCreate: (propertyType: IDealPropertyType) => void
  onClose: () => void
}

export function PropertyTypeForm({ isOpen, onClose, onCreate }: Props) {
  const activeBrandId = useActiveBrandId()
  const [isSaving, setIsSaving] = useState(false)

  const {
    control,
    formState: { isValid }
  } = useForm({
    mode: 'all'
  })

  const handleClose = () => {
    onClose()
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const propertyType = await createPropertyType(
        activeBrandId,
        control.getValues() as PropertyTypeData
      )

      onCreate(propertyType)
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
              defaultValue=""
              rules={{
                required: true,
                validate: value => value.trim().length > 0
              }}
              valida
              render={field => (
                <TextField
                  fullWidth
                  label="Property Name"
                  variant="outlined"
                  {...field}
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
          disabled={isSaving || !isValid}
          onClick={handleSave}
        >
          {isSaving ? 'Saving...' : 'Save Property'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
