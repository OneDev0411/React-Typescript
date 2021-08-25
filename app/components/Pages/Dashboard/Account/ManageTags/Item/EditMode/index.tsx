import {
  Theme,
  Button,
  Popover,
  TextField,
  Typography,
  makeStyles,
  InputAdornment
} from '@material-ui/core'
import { mdiClose } from '@mdi/js'
import pluralize from 'pluralize'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '320px'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(2, 3),
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    close: {
      display: 'inline-flex',
      cursor: 'pointer'
    },
    fields: {
      padding: theme.spacing(2.5, 2)
    },
    inputField: {
      width: '100%',
      '&:not(:first-child)': { marginTop: theme.spacing(2.5) }
    }
  }),
  {
    name: 'ManageTagsEditMode'
  }
)

interface Props {
  tag: IContactTag & { highlight: boolean }
  loading: boolean
  anchorEl: Nullable<HTMLElement>
  handleClose: () => void
  onSave: (text: string, touchDate: Nullable<number>) => Promise<void>
}

interface FormData {
  text: string
  touchDate: Nullable<string>
}

export function EditMode({
  tag,
  loading,
  anchorEl,
  onSave,
  handleClose
}: Props) {
  const classes = useStyles()
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<FormData>()

  const open = Boolean(anchorEl)
  const id = open ? 'popover-edit-tag' : undefined

  const handleOnSave: SubmitHandler<FormData> = ({ text, touchDate }) => {
    const numberTouchDate = parseInt(touchDate ?? '0', 10)

    onSave(text, numberTouchDate)
  }

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      <form onSubmit={handleSubmit(handleOnSave)} noValidate>
        <div className={classes.container}>
          <div className={classes.header}>
            <Typography variant="h6">Edit Tag</Typography>
            <div className={classes.close} onClick={handleClose}>
              <SvgIcon path={mdiClose} />
            </div>
          </div>
          <div className={classes.fields}>
            <Controller
              name="text"
              control={control}
              defaultValue={tag.text ?? ''}
              rules={{
                validate: (value: string) =>
                  !!value.trim() || 'This field is required.',
                maxLength: {
                  value: 100,
                  message: 'Please use a short name for tag.'
                }
              }}
              render={({ ...props }) => {
                const error: string | undefined = errors.text?.message

                return (
                  <TextField
                    {...props}
                    type="text"
                    size="small"
                    label="Title"
                    color="secondary"
                    error={!!error}
                    helperText={error}
                    variant="outlined"
                    className={classes.inputField}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )
              }}
            />
            <Controller
              name="touchDate"
              control={control}
              defaultValue={tag.touch_freq?.toString() ?? '0'}
              rules={{
                min: {
                  value: 0,
                  message: 'Touch date must be equal or greater than 0.'
                },
                max: {
                  value: 1000,
                  message: 'Touch Date must be less than 1000 or equal'
                }
              }}
              render={({ ref, value, ...props }) => {
                const error: string | undefined = errors.touchDate?.message

                return (
                  <TextField
                    {...props}
                    type="number"
                    label="Touch Date"
                    size="small"
                    color="secondary"
                    value={value}
                    InputLabelProps={{
                      shrink: true
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {pluralize('Day', value ?? 0)}
                        </InputAdornment>
                      ),
                      inputProps: {
                        min: 0
                      }
                    }}
                    error={!!error}
                    helperText={error}
                    variant="outlined"
                    className={classes.inputField}
                  />
                )
              }}
            />

            <Button
              color="secondary"
              variant="contained"
              type="submit"
              disabled={loading || !isDirty}
              className={classes.inputField}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </Popover>
  )
}
