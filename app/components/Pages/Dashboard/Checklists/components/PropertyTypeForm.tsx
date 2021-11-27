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
import { useSelector } from 'react-redux'

import { MultiSelectDropDown } from '@app/views/components/MultiSelectDropdown'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import {
  createPropertyType,
  PropertyTypeData
} from 'models/property-types/create-property-type'
import { updatePropertyType } from 'models/property-types/update-property-type'
import { selectUser } from 'selectors/user'
import { getActiveTeamId } from 'utils/user-teams'

import { roleName, ROLE_NAMES } from '../../Deals/utils/roles'

interface Props {
  propertyType?: IDealPropertyType
  isOpen: boolean
  onSave: (propertyType: IDealPropertyType) => void
  onClose: () => void
}

export function PropertyTypeForm({
  isOpen,
  propertyType,
  onClose,
  onSave
}: Props) {
  const [isSaving, setIsSaving] = useState(false)
  const user = useSelector(selectUser)
  const roles = ROLE_NAMES.map(role => ({
    value: role,
    label: roleName(role)
  }))

  const {
    control,
    formState: { isValid }
  } = useForm({
    mode: 'all',
    defaultValues: {
      label: propertyType?.label,
      is_lease: propertyType?.is_lease ?? false,
      required_roles: propertyType?.required_roles ?? [],
      optional_roles: propertyType?.optional_roles ?? []
    }
  })

  const handleClose = () => {
    onClose()
  }

  const handleSave = async () => {
    setIsSaving(true)

    const values = control.getValues() as PropertyTypeData
    const activeTeamId = getActiveTeamId(user)!

    try {
      const data = await (propertyType
        ? updatePropertyType(propertyType.id, activeTeamId, values)
        : createPropertyType(activeTeamId, values))

      onSave(data)
    } catch (e) {
      console.log(e)
    }

    setIsSaving(false)
  }

  return (
    <Dialog open={isOpen} fullWidth maxWidth="sm" onClose={handleClose}>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {propertyType
            ? `Edit ${propertyType.label}`
            : 'Add New Property Type'}
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

          <Grid item xs={12}>
            <Controller
              name="required_roles"
              control={control}
              render={({ onChange, value = false }) => (
                <Box>
                  <div>Required Roles</div>
                  <MultiSelectDropDown
                    list={roles}
                    defaultValues={
                      propertyType
                        ? roles.filter(({ value }) =>
                            propertyType.required_roles.includes(value)
                          )
                        : []
                    }
                    onChange={onChange}
                  />
                </Box>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="optional_roles"
              control={control}
              render={({ onChange, value = false }) => (
                <Box>
                  <div>Optional Roles</div>
                  <MultiSelectDropDown
                    list={roles}
                    defaultValues={
                      propertyType
                        ? roles.filter(({ value }) =>
                            propertyType.optional_roles.includes(value)
                          )
                        : []
                    }
                    onChange={onChange}
                  />
                </Box>
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
