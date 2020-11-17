import React, { useState, memo } from 'react'
import _get from 'lodash/get'
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

import MarketingTemplatePickerModal from 'components/MarketingTemplatePickerModal'

import { getTemplateType } from './helpers/get-template-type'

interface Props {
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
    body: {
      marginTop: theme.spacing(1),
      paddingTop: theme.spacing(1),
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
    templateSelectorContainer: {
      marginTop: theme.spacing(1)
    },
    templateSelector: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      '& span[data-for="title"]': {
        ...theme.typography.subtitle3
      },
      '& span[data-for="picker"]': {
        ...theme.typography.body2,
        color: theme.palette.secondary.main,
        cursor: 'pointer'
      }
    },
    templateSelectorPreview: {
      marginTop: theme.spacing(1),
      minHeight: `${theme.spacing(18.75)}px`,
      maxHeight: `${theme.spacing(18.75)}px`,
      background: theme.palette.grey[100],
      borderRadius: `${theme.spacing(2)}px`,
      textAlign: 'center',
      color: theme.palette.secondary.main,
      overflow: 'hidden',
      cursor: 'pointer',
      ...theme.typography.body2,
      '& img': {
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%'
      },
      '& > span': {
        display: 'block',
        marginTop: theme.spacing(7.75)
      }
    }
  }),
  { name: 'TriggerField' }
)

const TriggerFieldComponent = ({
  attributeName,
  currentValue,
  user,
  isActive: isActiveProp = false,
  subject: subjectProp = '',
  sendBefore: sendBeforeProp = 0,
  onChangeActive,
  onChangeSubject,
  onChangeSendBefore,
  onChangeTemplate
}: Props) => {
  const classes = useStyles()

  const [subject, setSubject] = useState<string>(subjectProp)
  const [isActive, setIsActive] = useState<boolean>(isActiveProp)
  const [sendBefore, setSendBefore] = useState<number>(sendBeforeProp)
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState<boolean>(
    false
  )
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
      setIsTemplatesModalOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  const renderTemplatePreview = () => {
    console.log({ attributeName, selectedTemplate, currentValue })

    if (selectedTemplate) {
      return (
        <img
          src={selectedTemplate.preview.preview_url}
          alt="Selected Template"
        />
      )
    }

    if (currentValue) {
      const preview = _get(
        currentValue,
        'campaign.template.file.preview_url',
        false
      )

      if (!preview) {
        return <span>Preivew is not Available</span>
      }

      return <img src={preview} alt="Selected Template" />
    }

    return <span>Select a Template</span>
  }

  return (
    <div className={classes.body}>
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
          Send automate email to this contact and don’t miss any important date
          ever.
        </Typography>
      </div>
      {isActive && (
        <>
          <div className={classes.templateSelectorContainer}>
            <div className={classes.templateSelector}>
              <span data-for="title">Template</span>
              {selectedTemplate && (
                <span
                  data-for="picker"
                  onClick={() => setIsTemplatesModalOpen(true)}
                >
                  Change
                </span>
              )}
            </div>
            <div
              className={classes.templateSelectorPreview}
              onClick={() => setIsTemplatesModalOpen(true)}
            >
              {renderTemplatePreview()}
            </div>
          </div>
          <TextField
            id="subject"
            label="subject"
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
            <InputLabel id="trigger-send-before">Send</InputLabel>
            <Select
              labelId="trigger-send-before"
              id="trigger-send-before-select"
              value={sendBefore}
              defaultValue={0}
              onChange={handleSendBeforeChange}
              label="Send"
            >
              <MenuItem value={0}>Same Day</MenuItem>
              {[1, 2, 3, 4].map(item => (
                <MenuItem key={item} value={item}>
                  {pluralize(`${item} Day`, item)} earlier
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      {isTemplatesModalOpen && (
        <MarketingTemplatePickerModal
          title="Select Template"
          user={user}
          mediums={['Email' as MarketingTemplateMedium.Email]}
          templateTypes={[getTemplateType(attributeName)]}
          onSelect={handleSelectTemplate}
          onClose={() => setIsTemplatesModalOpen(false)}
        />
      )}
    </div>
  )
}

export const TriggerField = memo(TriggerFieldComponent)
