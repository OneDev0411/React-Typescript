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
import { useForm, FormProvider, Controller } from 'react-hook-form'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import {
  createPropertyType,
  PropertyTypeData
} from 'models/property-types/create-property-type'
import { updatePropertyType } from 'models/property-types/update-property-type'

import { getDefaultRoles } from './helpers/get-default-roles'
import { pickRoles } from './helpers/pick-roles'
import { rolesArrayToObject } from './helpers/roles-array-to-object'
import { Roles } from './Roles'

interface FormValues extends Pick<PropertyTypeData, 'label' | 'is_lease'> {
  roles: Record<string, boolean | undefined>
}

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
  const activeBrandId = useActiveBrandId()

  const methods = useForm({
    mode: 'all',
    defaultValues: {
      label: propertyType?.label as string,
      is_lease: propertyType?.is_lease ?? false,
      roles: propertyType
        ? rolesArrayToObject(
            propertyType.required_roles,
            propertyType.optional_roles
          )
        : getDefaultRoles(false)
    }
  })

  const {
    control,
    reset,
    formState: { isValid }
  } = methods

  const handleClose = () => {
    onClose()
  }

  const handleChangeLease = (checked: boolean) => {
    reset({
      ...control.getValues(),
      roles: getDefaultRoles(checked)
    })
  }

  const handleSave = async () => {
    setIsSaving(true)

    const form = control.getValues() as FormValues

    const values: PropertyTypeData = {
      label: form.label,
      is_lease: form.is_lease,
      required_roles: pickRoles(form.roles, true),
      optional_roles: pickRoles(form.roles, false)
    }

    try {
      const data = await (propertyType
        ? updatePropertyType(propertyType.id, activeBrandId, values)
        : createPropertyType(activeBrandId, values))

      onSave(data)
    } catch (e) {
      console.log(e)
    }

    setIsSaving(false)
  }

  return (
    <Dialog open={isOpen} fullWidth maxWidth="sm" onClose={handleClose}>
      <FormProvider {...methods}>
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            {propertyType
              ? `Edit ${propertyType.label}`
              : 'Add New Property Type'}
            <IconButton onClick={handleClose}>
              <SvgIcon path={mdiClose} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          style={{
            minHeight: '70vh'
          }}
        >
          <Grid
            container
            style={{
              flexGrow: 1
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={8}>
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
                      size="small"
                      {...field}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={4}>
                <Controller
                  name="is_lease"
                  control={control}
                  defaultValue={propertyType?.is_lease ?? false}
                  render={({ onChange, value }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={value}
                          onChange={e => {
                            const { checked } = e.target

                            onChange(checked)
                            handleChangeLease(checked)
                          }}
                        />
                      }
                      label="Lease Property"
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Roles control={control} />
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
      </FormProvider>
    </Dialog>
  )
}
