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

import { AvatarUpload } from '@app/views/components/AvatarUpload'
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
  onSubmit: (values: any) => void
}

export function AddTeamMembersModal({
  isOpen,
  team,
  onClose,
  onSubmit
}: Props) {
  const classes = useStyles()

  const { control, errors, handleSubmit } = useForm<FormData>({
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

  const onSubmitForm = (data: FormData) => console.log(data)

  return (
    <Dialog open={isOpen} fullWidth maxWidth="sm" onClose={onClose}>
      <DialogTitle onClose={onClose}>Add Member</DialogTitle>
      <DialogContent>
        <Box width="100%" my={2}>
          <Box mb={3} display="flex" justifyContent="center">
            <Controller
              name="avatar"
              control={control}
              render={field => (
                <AvatarUpload
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
                required: true,
                validate: value => value?.length > 0 && isEmail(value)
              }}
              control={control}
              render={field => (
                <TextField
                  size="small"
                  placeholder="Email"
                  fullWidth
                  variant="outlined"
                  error={!!errors.email}
                  helperText={
                    errors.email ? 'You must enter a valid email address' : null
                  }
                  {...field}
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
              render={field => (
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Phone"
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
                const onToggle = roleId => {
                  const newValue = field.value.includes(roleId)
                    ? field.value.filter(item => item !== roleId)
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
          <Button size="small" variant="contained">
            Cancel
          </Button>
          <Box ml={1}>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={handleSubmit(onSubmitForm)}
            >
              Add
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
