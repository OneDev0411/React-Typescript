import {
  FormControl,
  makeStyles,
  Typography,
  InputLabel,
  TextField,
  MenuItem,
  Popover,
  Button,
  Select,
  Theme,
  Box
} from '@material-ui/core'
import pluralize from 'pluralize'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
// import cn from 'classnames'

// import { TemplateSelector } from './components/TemplateSelector'
// import { convertSecondsToDay } from './helpers'

interface Props {
  anchor: Nullable<HTMLElement>
  handleClose: () => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      padding: theme.spacing(1.5)
    },
    fieldsContainer: {
      display: 'flex',
      alignItems: 'flex-start'
    },
    fieldsColumn: {
      width: '305px',
      padding: theme.spacing(0, 1)
    },
    triggerFields: {},
    titleContainer: {
      marginBottom: theme.spacing(1)
    },
    description: {
      marginTop: theme.spacing(0.5),
      color: theme.palette.grey[500]
    },
    inputField: {
      width: '100%',
      marginTop: theme.spacing(2)
    },
    actions: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: theme.spacing(1.5),
      paddingTop: theme.spacing(1.5),
      borderTop: `1px solid ${theme.palette.divider}`
    }
  }),
  { name: 'TriggerEditMode' }
)

export function TriggerEditMode({ anchor, handleClose }: Props) {
  const classes = useStyles()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<IGlobalTriggerInput>()
  const open = Boolean(anchor)
  const id = open ? 'edit-mode-popover' : undefined

  const handleOnSave: SubmitHandler<IGlobalTriggerInput> = data => {
    console.log({ data })
  }

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchor}
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
          <div className={classes.fieldsContainer}>
            <div className={classes.fieldsColumn}>
              <div className={classes.triggerFields}>
                <div className={classes.titleContainer}>
                  <Typography component="span" variant="subtitle2">
                    Automate Email
                  </Typography>
                  <Typography
                    component="p"
                    variant="body2"
                    className={classes.description}
                  >
                    Send automate email to the contacts and don’t miss any
                    important date ever.
                  </Typography>
                </div>
                <>
                  <Controller
                    name="subject"
                    control={control}
                    defaultValue="ddd"
                    rules={{
                      validate: (value: string) =>
                        !!value.trim() || 'This field is required.'
                    }}
                    render={({ ...props }) => {
                      const error: string | undefined = errors.subject?.message

                      return (
                        <TextField
                          {...props}
                          label="Subject"
                          size="small"
                          variant="outlined"
                          disabled={isSubmitting}
                          error={!!error}
                          helperText={error}
                          className={classes.inputField}
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      )
                    }}
                  />
                  <Controller
                    name="wait_for"
                    type="number"
                    control={control}
                    defaultValue={0}
                    render={({ value, onChange }) => {
                      return (
                        <FormControl
                          variant="outlined"
                          size="small"
                          disabled={isSubmitting}
                          className={classes.inputField}
                        >
                          <InputLabel id="trigger-send-before">
                            Deliver in
                          </InputLabel>
                          <Select
                            labelId="trigger-send-before"
                            id="trigger-send-before-select"
                            disabled={isSubmitting}
                            value={value}
                            onChange={event => onChange(event.target.value)}
                            label="Deliver in"
                          >
                            <MenuItem value={0}>Same Day</MenuItem>
                            {[1, 2, 3, 4].map(item => (
                              <MenuItem key={item} value={item}>
                                {pluralize('day', item, true)} earlier
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </>
              </div>
            </div>
            <div className={classes.fieldsColumn}>dddd</div>
          </div>
          <div className={classes.actions}>
            <Box mr={1}>
              <Button size="small" disabled={isSubmitting}>
                Cancel
              </Button>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="small"
              disabled={isSubmitting}
            >
              Save
              {/* {isSaving ? 'Saving...' : 'Save'} */}
            </Button>
          </div>
        </div>
      </form>
    </Popover>
  )
}
