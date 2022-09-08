import { useState } from 'react'

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
import isEmail from 'validator/lib/isEmail'

import useNotify from '@app/hooks/use-notify'
import { convertUrlToImageFile } from '@app/utils/file-utils/convert-url-to-image-file'
import { isValidPhoneNumber } from '@app/utils/helpers'
import { AvatarUpload } from '@app/views/components/AvatarUpload'
import { UserAutocomplete } from '@app/views/components/ContactAutocomplete'
import { DialogTitle } from '@app/views/components/DialogTitle'
import { MaskedInput } from 'components/MaskedInput'

const useStyles = makeStyles(
  (theme: Theme) => ({
    avatar: {
      width: theme.spacing(10),
      height: theme.spacing(10)
    }
  }),
  {
    name: 'AddTeamMembersModal'
  }
)

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar: Nullable<File>
  roles: UUID[]
}

interface Props {
  isOpen: boolean
  team: Nullable<IBrand>
  onClose: () => void
  onSubmit: (values: any) => Promise<void>
}

export function AddTeamMembersModal({
  isOpen,
  team,
  onClose,
  onSubmit
}: Props) {
  const classes = useStyles()
  const [isSaving, setIsSaving] = useState(false)
  const notify = useNotify()

  const { control, errors, formState, handleSubmit, watch, reset } =
    useForm<FormData>({
      mode: 'all',
      defaultValues: {
        avatar: null,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        roles: []
      }
    })

  const isEmailRequired = !watch('phone')
  const isPhoneRequired = !watch('email')

  const onSubmitForm = async (data: FormData) => {
    try {
      setIsSaving(true)
      await onSubmit(data)
    } catch (e) {
      notify({
        status: 'error',
        message: e?.response?.body?.message ?? e.message
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    reset({}, { isDirty: false })
    onClose()
  }

  return (
    <Dialog open={isOpen} fullWidth maxWidth="sm" onClose={handleClose}>
      <DialogTitle onClose={handleClose}>Add Member</DialogTitle>
      <DialogContent>
        <Box width="100%" my={2}>
          <Box mb={3} display="flex" justifyContent="center">
            <Controller
              name="avatar"
              control={control}
              render={field => (
                <AvatarUpload
                  file={field.value}
                  classes={{
                    avatar: classes.avatar
                  }}
                  onSelect={file => field.onChange(file)}
                />
              )}
            />
          </Box>

          <Box mb={1}>
            <Controller
              name="email"
              rules={{
                required: isEmailRequired,
                validate: value =>
                  isEmailRequired
                    ? value?.trim().length > 0 && isEmail(value)
                    : true
              }}
              control={control}
              render={field => (
                <UserAutocomplete
                  multiple={false}
                  onChange={async ({ contacts, emails }) => {
                    const email = emails[0]
                    const contact = contacts[0]

                    field.onChange(email ?? '')

                    if (contact) {
                      control.setValue('firstName', contact.first_name, {
                        shouldValidate: true
                      })
                      control.setValue('lastName', contact.last_name, {
                        shouldValidate: true
                      })
                      control.setValue('phone', contact.phone_number, {
                        shouldValidate: true
                      })

                      if (contact.profile_image_url) {
                        control.setValue(
                          'avatar',
                          await convertUrlToImageFile(contact.profile_image_url)
                        )
                      }
                    }
                  }}
                  TextFieldProps={{
                    size: 'small',
                    placeholder: 'Email',
                    fullWidth: true,
                    variant: 'outlined',
                    error: isEmailRequired && !!errors.email,
                    helperText:
                      isEmailRequired && errors.email
                        ? 'You must enter a valid email address'
                        : null,
                    ...field
                  }}
                />
              )}
            />
          </Box>

          <Box display="flex" alignItems="center" width="100%" mb={1}>
            <Box flex={1} mr={2}>
              <Controller
                name="firstName"
                control={control}
                render={field => (
                  <TextField
                    size="small"
                    placeholder="First Name"
                    fullWidth
                    variant="outlined"
                    {...field}
                  />
                )}
              />
            </Box>
            <Box flex={1}>
              <Controller
                name="lastName"
                control={control}
                render={field => (
                  <TextField
                    size="small"
                    placeholder="Last Name"
                    fullWidth
                    variant="outlined"
                    {...field}
                  />
                )}
              />
            </Box>
          </Box>

          <Box mb={2}>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: isPhoneRequired,
                validate: async value =>
                  isPhoneRequired ? isValidPhoneNumber(value) : true
              }}
              render={field => (
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Phone"
                  error={isPhoneRequired && !!errors.phone}
                  helperText={
                    isPhoneRequired && errors.phone
                      ? 'You must enter a valid phone number'
                      : null
                  }
                  InputProps={{
                    inputProps: {
                      mask: [
                        '(',
                        /[1-9]/,
                        /\d/,
                        /\d/,
                        ')',
                        ' ',
                        /\d/,
                        /\d/,
                        /\d/,
                        '-',
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/
                      ]
                    },
                    inputComponent: MaskedInput,
                    ...field
                  }}
                />
              )}
            />
          </Box>

          <Box px={1}>
            <Controller
              name="roles"
              control={control}
              rules={{
                required: true,
                validate: list => list.length > 0
              }}
              defaultValue={[]}
              render={field => {
                const onToggle = (roleId: UUID) => {
                  const newValue = field.value.includes(roleId)
                    ? field.value.filter((item: UUID) => item !== roleId)
                    : [...field.value, roleId]

                  field.onChange(newValue)
                }

                const roles: IBrandRole[] = (team && team.roles) || []

                if (roles.length === 0) {
                  return <></>
                }

                return (
                  <>
                    <div>
                      <Box mr={1}>
                        <strong>Roles</strong>
                      </Box>
                      {roles.map(role => (
                        <FormControlLabel
                          key={role.id}
                          control={
                            <Checkbox
                              size="small"
                              checked={field.value.includes(role.id)}
                              onChange={() => onToggle(role.id)}
                              name="checkedA"
                            />
                          }
                          label={role.role}
                        />
                      ))}
                    </div>

                    {errors.roles && (
                      <Typography variant="caption" color="error">
                        At least one role should be selected
                      </Typography>
                    )}
                  </>
                )
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Box display="flex" alignItems="center">
          <Button
            disabled={isSaving}
            size="small"
            variant="contained"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Box ml={1}>
            <Button
              size="small"
              color="primary"
              variant="contained"
              disabled={isSaving || !formState.isDirty}
              onClick={handleSubmit(onSubmitForm)}
            >
              {isSaving ? 'Saving...' : 'Add'}
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
