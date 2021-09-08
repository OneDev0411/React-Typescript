import {
  FormControl,
  makeStyles,
  Typography,
  InputLabel,
  TextField,
  MenuItem,
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

interface Props {}

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

export function TriggerEditMode(props: Props) {
  const classes = useStyles()
  const { control, handleSubmit } = useForm<IGlobalTriggerInput>()

  const handleOnSave: SubmitHandler<IGlobalTriggerInput> = data => {
    console.log({ data })
  }

  return (
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
                <TextField
                  id="subject"
                  label="Subject"
                  type="text"
                  size="small"
                  // disabled={disabled || !isActive || isSaving}
                  defaultValue="dddd"
                  InputLabelProps={{
                    shrink: true
                  }}
                  variant="outlined"
                  className={classes.inputField}
                />
                <FormControl
                  variant="outlined"
                  size="small"
                  className={classes.inputField}
                  // disabled={disabled || !isActive || isSaving}
                >
                  <InputLabel id="trigger-send-before">Deliver in</InputLabel>
                  <Select
                    labelId="trigger-send-before"
                    id="trigger-send-before-select"
                    value={0}
                    defaultValue={0}
                    // onChange={handleSendBeforeChange}
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
              </>
            </div>
          </div>
          <div className={classes.fieldsColumn}>dddd</div>
        </div>
        <div className={classes.actions}>
          <Box mr={1}>
            <Button
              size="small" /* disabled={isDisabled} onClick={handleCancel} */
            >
              Cancel
            </Button>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            // disabled={isDisabled}
            // onClick={handleSave}
          >
            Save
            {/* {isSaving ? 'Saving...' : 'Save'} */}
          </Button>
        </div>
      </div>
    </form>
  )
}
