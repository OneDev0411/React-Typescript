import React, { ReactNode, useState, memo } from 'react'
import {
  FormControl,
  Typography,
  InputLabel,
  TextField,
  MenuItem,
  Select,
  Switch,
  makeStyles,
  Theme
} from '@material-ui/core'
import pluralize from 'pluralize'

import { TemplateSelector } from './components/TemplateSelector'
import { getTriggerSubject } from './helpers/get-trigger-subject'

interface Props {
  renderAttributeFields: () => ReactNode
  attributeName: TriggerContactEventTypes
  currentValue: Nullable<ITrigger>
  user: IUser
  isActive: boolean
  subject: string
  sendBefore: number
  onChangeActive: (value: boolean) => void
  onChangeSubject: (value: string) => void
  onChangeSendBefore: (value: number) => void
  onChangeTemplate: (template: IBrandMarketingTemplate) => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'flex-start'
    },
    containerItem: {
      width: '305px',
      padding: theme.spacing(0, 1)
    },
    triggerFields: {
      marginTop: theme.spacing(1.5),
      paddingTop: theme.spacing(1.5),
      borderTop: `1px solid ${theme.palette.divider}`
    },
    switch: {
      marginBottom: theme.spacing(1)
    },
    switchContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    switchDesc: {
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

const TriggerEditModeComponent = ({
  user,
  currentValue,
  attributeName,
  renderAttributeFields,
  isActive: isActiveProp = false,
  sendBefore: sendBeforeProp = 0,
  subject: subjectProp = '',
  onChangeActive,
  onChangeSubject,
  onChangeSendBefore,
  onChangeTemplate
}: Props) => {
  const classes = useStyles()

  const [subject, setSubject] = useState<string>(
    subjectProp || getTriggerSubject(attributeName)
  )
  const [isActive, setIsActive] = useState<boolean>(isActiveProp)
  const [sendBefore, setSendBefore] = useState<number>(sendBeforeProp)
  const [selectedTemplate, setSelectedTemplate] = useState<
    Nullable<IBrandMarketingTemplate>
  >(null)

  const handleActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked

    setIsActive(checked)
    onChangeActive(checked)
  }

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setSubject(value)
    onChangeSubject(value)
  }

  const handleSendBeforeChange = (
    event: React.ChangeEvent<{ value: number }>
  ) => {
    const value = event.target.value

    // -86400 number of millisecond of a day
    const waitFor = Number(value) * -86400

    setSendBefore(value)
    onChangeSendBefore(waitFor)
  }

  const handleSelectTemplate = (template: IBrandMarketingTemplate) => {
    try {
      setSelectedTemplate(template)
      onChangeTemplate(template)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.containerItem}>
        {renderAttributeFields()}
        <div className={classes.triggerFields}>
          <div className={classes.switch}>
            <div className={classes.switchContainer}>
              <Typography component="span" variant="subtitle2">
                Automate Email
              </Typography>
              <Switch
                checked={isActive}
                onChange={handleActiveChange}
                color="primary"
                size="small"
              />
            </div>
            <Typography
              component="p"
              variant="body2"
              className={classes.switchDesc}
            >
              Send automate email to this contact and don’t miss any important
              date ever.
            </Typography>
          </div>
          {isActive && (
            <>
              <TextField
                id="subject"
                label="Subject"
                type="text"
                size="small"
                defaultValue={subject}
                InputLabelProps={{
                  shrink: true
                }}
                variant="outlined"
                className={classes.inputField}
                onChange={handleSubjectChange}
              />
              <FormControl
                variant="outlined"
                size="small"
                className={classes.inputField}
              >
                <InputLabel id="trigger-send-before">Deliver in</InputLabel>
                <Select
                  labelId="trigger-send-before"
                  id="trigger-send-before-select"
                  value={sendBefore}
                  defaultValue={0}
                  onChange={handleSendBeforeChange}
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
          )}
        </div>
      </div>
      {isActive && (
        <div className={classes.containerItem}>
          <TemplateSelector
            user={user}
            currentValue={currentValue}
            attributeName={attributeName}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleSelectTemplate}
          />
        </div>
      )}
    </div>
  )
}

export const TriggerEditMode = memo(TriggerEditModeComponent)
