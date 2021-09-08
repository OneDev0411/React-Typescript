import {
  FormControl,
  makeStyles,
  Typography,
  InputLabel,
  TextField,
  MenuItem,
  Select,
  Theme
} from '@material-ui/core'
// import cn from 'classnames'
import pluralize from 'pluralize'

// import { TemplateSelector } from './components/TemplateSelector'
// import { convertSecondsToDay } from './helpers'

interface Props {}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'flex-start',
      padding: theme.spacing(1)
    },
    containerItem: {
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
    }
  }),
  { name: 'TriggerEditMode' }
)

export function TriggerEditMode(props: Props) {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.containerItem}>
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
              Send automate email to the contacts and don’t miss any important
              date ever.
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
      <div className={classes.containerItem}>dddd</div>
    </div>
  )
}
