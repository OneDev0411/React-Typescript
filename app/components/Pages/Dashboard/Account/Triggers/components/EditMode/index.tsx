import { useMemo } from 'react'

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
import { useDispatch, useSelector } from 'react-redux'

import { getTemplateType } from '@app/components/Pages/Dashboard/Contacts/Profile/components/ContactAttributeInlineEditableField/TriggerEditMode/helpers'
import { TemplateSelector } from '@app/components/Pages/Dashboard/Flows/Edit/Steps/New/components/BaseFields/TemplateInctance/Selector'
import { createTrigger } from '@app/models/instant-marketing/global-triggers'
import { selectActiveBrand } from '@app/selectors/brand'
import { selectUser } from '@app/selectors/user'
import { setGlobalTrigger } from '@app/store_actions/global-triggers'
import { IAppState } from 'reducers'

import { generateInitialValues, generatePayload } from './helpers'

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

interface Props {
  anchor: Nullable<HTMLElement>
  containerRef?: Nullable<HTMLDivElement>

  eventType?: TriggerContactEventTypes
  trigger?: IGlobalTrigger<'template' | 'template_instance'>
  callback?: (trigger: IGlobalTrigger<'template' | 'template_instance'>) => void
  handleClose: () => void
}

export function TriggerEditMode({
  containerRef = null,
  eventType,
  trigger,
  anchor,
  callback,
  handleClose
}: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const user = useSelector<IAppState, IUser>(selectUser)
  const brand = useSelector<IAppState, IBrand>(selectActiveBrand)

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting }
  } = useForm<IGlobalTriggerFormData>()

  const currentEventType: TriggerContactEventTypes | undefined = useMemo(
    () => eventType ?? trigger?.event_type,
    [eventType, trigger?.event_type]
  )
  const initialValue: IGlobalTriggerFormData = useMemo(
    () => generateInitialValues(trigger, currentEventType),
    [trigger, currentEventType]
  )
  const templatesType: IMarketingTemplateType = useMemo(
    () => getTemplateType(currentEventType!),
    [currentEventType]
  )

  if (!currentEventType) {
    return null
  }

  const handleOnSave: SubmitHandler<IGlobalTriggerFormData> = async data => {
    const payload = await generatePayload(data, brand, user, currentEventType)

    try {
      const trigger = (await createTrigger(payload)).data

      dispatch(setGlobalTrigger(trigger))

      if (callback) {
        callback(trigger)
      }

      handleClose()
    } catch (err) {
      console.error(err)
    }
  }

  const open = Boolean(anchor)
  const id = open ? 'edit-mode-popover' : undefined

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchor}
      disableEnforceFocus
      container={containerRef}
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
              <div>
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
                    defaultValue={initialValue.subject}
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
                    defaultValue={initialValue.wait_for}
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
                            onChange={event => {
                              const waitFor = Number(event.target.value)

                              onChange(waitFor)
                            }}
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
            <div className={classes.fieldsColumn}>
              <Controller
                name="template"
                control={control}
                defaultValue={initialValue.template}
                rules={{
                  validate: (template: IGlobalTriggerFormData['template']) => {
                    if (!template) {
                      return 'This field is required.'
                    }
                  }
                }}
                render={({ value, onChange }) => {
                  // @ts-ignore
                  const error: string | undefined = errors.template?.message

                  return (
                    <TemplateSelector
                      disabled={isSubmitting}
                      templateTypes={[templatesType]}
                      hasError={!!error}
                      error={error}
                      currentTemplate={
                        trigger?.template_instance ?? trigger?.template ?? null
                      }
                      onChange={onChange}
                    />
                  )
                }}
              />
            </div>
          </div>
          <div className={classes.actions}>
            <Box mr={1}>
              <Button
                size="small"
                onClick={handleClose}
                disabled={isSubmitting || !isDirty}
              >
                Cancel
              </Button>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="small"
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </form>
    </Popover>
  )
}
