import { useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  FormControl,
  Grid,
  TextField,
  makeStyles,
  Theme
} from '@material-ui/core'

import { useForm, Controller } from 'react-hook-form'

import { mdiClose } from '@mdi/js'

import { useDispatch } from 'react-redux'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { addNotification } from '@app/views/components/notification'

import { getStatusActiveType, StatusTypes } from './helpers/get-status-types'

import { PropertyChecklistTable } from './PropertyChecklistTable'

const useStyles = makeStyles(
  (theme: Theme) => ({
    previousLabel: {
      color: theme.palette.error.main
    }
  }),
  {
    name: 'DealStatuses-Edit'
  }
)

interface FormData {
  label: string
  admin_only: boolean
  type: string
  checklists: Record<UUID, boolean>
}

interface Props {
  status: IDealStatus | undefined
  onChange: (statusId: UUID, data: Record<string, unknown>) => void
  onClose: () => void
}

export function EditStatus({ status, onChange, onClose }: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [isSaving, setIsSaving] = useState(false)
  const { handleSubmit, control, watch, formState } = useForm({
    mode: 'all'
  })

  const newLabel = watch('label') || status?.label

  const handleSave = async (form: FormData) => {
    const data = {
      ...StatusTypes.reduce(
        (acc, type) => ({
          ...acc,
          [type.key]: type.key === form.type
        }),
        {}
      ),
      label: form.label,
      admin_only: form.admin_only,
      checklists: Object.entries(form.checklists)
        .filter(([_, value]) => !!value)
        .map(([key]) => key)
    }

    try {
      setIsSaving(true)

      await onChange(status!.id, data)

      dispatch(
        addNotification({
          status: 'success',
          message: 'Status Updated'
        })
      )
    } catch (e) {
      console.log(e)

      dispatch(
        addNotification({
          status: 'error',
          message: 'Could not update the status'
        })
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={!!status} fullWidth maxWidth="sm" onClose={onClose}>
      <form onSubmit={handleSubmit(handleSave)}>
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <div>
              Update{' '}
              {status?.label === newLabel ? (
                <span>"{status?.label}"</span>
              ) : (
                <>
                  <span className={classes.previousLabel}>
                    "{status?.label}"
                  </span>
                  {' → '}
                  {newLabel}
                </>
              )}
            </div>
            <IconButton onClick={onClose}>
              <SvgIcon path={mdiClose} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Grid container>
            <Grid item xs={10}>
              <FormControl fullWidth margin="normal">
                <Controller
                  control={control}
                  name="label"
                  defaultValue={status?.label}
                  rules={{
                    validate: (val: string) => val.length > 0
                  }}
                  render={({ value, onChange, onBlur }) => (
                    <TextField
                      value={value}
                      variant="outlined"
                      size="small"
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={3}>
              <FormControl fullWidth margin="normal">
                <FormLabel>Admin Settings</FormLabel>

                <Controller
                  control={control}
                  name="admin_only"
                  defaultValue={status?.admin_only}
                  render={({ value, onChange }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={value}
                          color="primary"
                          onChange={e => onChange(e.target.checked)}
                        />
                      }
                      label="Admin Only"
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={9}>
              <FormControl margin="normal" fullWidth>
                <FormLabel>Type</FormLabel>

                <Controller
                  control={control}
                  name="type"
                  defaultValue={getStatusActiveType(status)}
                  render={({ value, name, onChange }) => (
                    <RadioGroup
                      row
                      name={name}
                      value={value}
                      onChange={e => onChange(e.target.value)}
                    >
                      {StatusTypes.map(type => (
                        <FormControlLabel
                          key={type.key}
                          value={type.key}
                          control={<Radio color="primary" />}
                          label={type.label}
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>

          <FormControl fullWidth margin="normal">
            <PropertyChecklistTable status={status} formControl={control} />
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Box mx={2}>
            <Button onClick={onClose}>Cancel</Button>

            <Button
              color="primary"
              type="submit"
              variant="contained"
              disabled={isSaving || formState.isValid === false}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  )
}
