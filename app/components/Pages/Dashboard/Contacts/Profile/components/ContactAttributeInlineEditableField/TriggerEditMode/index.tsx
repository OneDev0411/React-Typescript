import React, { ReactNode, useState, memo } from 'react'

import {
  FormControl,
  makeStyles,
  IconButton,
  Typography,
  InputLabel,
  TextField,
  MenuItem,
  Tooltip,
  Select,
  Switch,
  Theme
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { mdiClose, mdiNewBox } from '@mdi/js'
import cn from 'classnames'
import pluralize from 'pluralize'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { TeamContactSelect } from '@app/views/components/TeamContact/TeamContactSelect'
import { goTo } from 'utils/go-to'
import { isSoloActiveTeam } from 'utils/user-teams'

import { TemplateSelector } from './components/TemplateSelector'
import { convertSecondsToDay } from './helpers'

const useStyles = makeStyles(
  (theme: Theme) => ({
    fieldsContainer: {
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
    },
    senderContainer: {
      marginBottom: theme.spacing(1.25)
    },
    sender: {
      display: 'inline-flex',
      alignItems: 'center',
      cursor: 'pointer'
    },
    disabledSender: { opacity: 0.6 },
    senderLabel: {
      marginLeft: theme.spacing(0.5),
      color: theme.palette.grey[500]
    },
    promoteGlobalTriggerContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing(2)
    },
    goToGlobalTrigger: {
      cursor: 'pointer'
    }
  }),
  { name: 'TriggerEditMode' }
)

interface Props {
  sender: IUser
  disabled?: boolean
  renderAttributeFields: () => ReactNode
  attributeName: TriggerContactEventTypes
  attributeGlobalTrigger?: IGlobalTrigger<'template' | 'template_instance'>
  isActive: boolean
  isSaving?: boolean
  subject: string
  sendBefore: number
  selectedTemplate: Nullable<
    IMarketingTemplateInstance | IBrandMarketingTemplate
  >
  onChangeActive: (value: boolean) => void
  onChangeSubject: (value: string) => void
  onChangeSender: (value: IUser) => void
  onChangeSendBefore: (value: number) => void
  onChangeTemplate: (templateInstance: IMarketingTemplateInstance) => void
}

const TriggerEditModeComponent = ({
  disabled = false,
  isSaving = false,
  attributeName,
  renderAttributeFields,
  attributeGlobalTrigger,
  isActive: isActiveProp = false,
  sendBefore: sendBeforeProp = 0,
  sender: senderProp,
  subject: subjectProp = '',
  selectedTemplate: selectedTemplateProp = null,
  onChangeSender,
  onChangeActive,
  onChangeSubject,
  onChangeSendBefore,
  onChangeTemplate
}: Props) => {
  const classes = useStyles()
  const activeTeam = useUnsafeActiveTeam()
  const [sender, setSender] = useState<IUser>(senderProp)
  const [subject, setSubject] = useState<string>(subjectProp)
  const [isActive, setIsActive] = useState<boolean>(isActiveProp)
  const [sendBefore, setSendBefore] = useState<number>(
    convertSecondsToDay(sendBeforeProp)
  )
  const [selectedTemplate, setSelectedTemplate] =
    useState<Nullable<IMarketingTemplateInstance | IBrandMarketingTemplate>>(
      selectedTemplateProp
    )

  // Show global trigger feature banner
  const [isGlobalTriggerInfoOpen, setIsGlobalTriggerInfoOpen] =
    useState<boolean>(!attributeGlobalTrigger)

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

  const handleSenderChange = sender => {
    const user = sender.value

    setSender(user)
    onChangeSender(user)
  }

  const handleSelectTemplate = (
    templateInstance: IMarketingTemplateInstance
  ) => {
    try {
      setSelectedTemplate(templateInstance)
      onChangeTemplate(templateInstance)
    } catch (error) {
      console.error(error)
    }
  }

  const renderSenderSwitcher = () => {
    if (isSoloActiveTeam(activeTeam)) {
      return null
    }

    return (
      <div className={classes.senderContainer}>
        <TeamContactSelect
          /* @ts-ignore */
          disabled={disabled || !isActive || isSaving}
          owner={sender}
          user={sender}
          onSelect={handleSenderChange}
          buttonRenderer={buttonProps => {
            const title = buttonProps.selectedItem.label

            return (
              <Tooltip
                title={
                  !buttonProps.disabled
                    ? 'Click to Change Sender'
                    : 'Trigger is not Active'
                }
              >
                <div
                  className={cn(classes.sender, {
                    [classes.disabledSender]: buttonProps.disabled
                  })}
                  onClick={buttonProps.onClick}
                >
                  <Typography variant="body2">{title}</Typography>
                  <Typography variant="caption" className={classes.senderLabel}>
                    Sender
                  </Typography>
                </div>
              </Tooltip>
            )
          }}
          fullWidth
        />
      </div>
    )
  }

  return (
    <>
      {isGlobalTriggerInfoOpen && (
        <Alert
          severity="success"
          className={classes.promoteGlobalTriggerContainer}
          icon={<SvgIcon path={mdiNewBox} />}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setIsGlobalTriggerInfoOpen(false)
              }}
            >
              <SvgIcon path={mdiClose} />
            </IconButton>
          }
        >
          <Typography variant="body2" color="textPrimary">
            You can send emails to all your contacts automatically.
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            className={classes.goToGlobalTrigger}
            onClick={() => goTo('/dashboard/account/triggers')}
          >
            Activate Global Trigger From The Settings
          </Typography>
        </Alert>
      )}
      <div className={classes.fieldsContainer}>
        <div className={classes.containerItem}>
          {renderAttributeFields()}
          <div className={classes.triggerFields}>
            {renderSenderSwitcher()}
            <div className={classes.switch}>
              <div className={classes.switchContainer}>
                <Typography component="span" variant="subtitle2">
                  Automate Email
                </Typography>
                <Switch
                  checked={isActive}
                  disabled={disabled}
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
            <>
              <TextField
                id="subject"
                label="Subject"
                type="text"
                size="small"
                disabled={disabled || !isActive || isSaving}
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
                disabled={disabled || !isActive || isSaving}
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
          </div>
        </div>
        <div className={classes.containerItem}>
          <TemplateSelector
            disabled={disabled || !isActive || isSaving}
            attributeName={attributeName}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleSelectTemplate}
          />
        </div>
      </div>
    </>
  )
}

export const TriggerEditMode = memo(TriggerEditModeComponent)
