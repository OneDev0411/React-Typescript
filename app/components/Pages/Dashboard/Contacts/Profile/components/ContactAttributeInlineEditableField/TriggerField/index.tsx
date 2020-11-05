import React, { useState } from 'react'

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  makeStyles,
  Theme
} from '@material-ui/core'

import MarketingTemplatePickerModal from 'components/MarketingTemplatePickerModal'

interface Props {
  current: ITrigger | null
  user: IUser
  isActive: boolean
  sendBefore: string | number
  toggleActive: () => void
  onChangeSendBefore: (value: string | number) => void
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
    switchTitle: {
      ...theme.typography.subtitle2
    },
    switchDesc: {
      marginTop: theme.spacing(0.5),
      ...theme.typography.body2,
      color: theme.palette.grey[500]
    },
    sendBefore: {
      width: '100%',
      marginTop: theme.spacing(2),
      '& .MuiOutlinedInput-input': {
        padding: theme.spacing(1.5, 1.75)
      }
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
  { name: 'TriggerFields' }
)

export const TriggerField = ({
  user,
  isActive: isActiveProp = false,
  sendBefore: sendBeforeProp = '1',
  toggleActive,
  onChangeSendBefore,
  onChangeTemplate
}: Props) => {
  const classes = useStyles()

  const [isActive, setIsActive] = useState(isActiveProp)
  const [sendBefore, setSendBefore] = useState<string | number>(sendBeforeProp)
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState<boolean>(
    false
  )
  const [
    selectedTemplate,
    setSelectedTemplate
  ] = useState<IBrandMarketingTemplate | null>(null)

  const handleActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsActive(event.target.checked)
    toggleActive()
  }

  const handleSendBeforeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const value = event.target.value as string

    setSendBefore(value)
    onChangeSendBefore(value)
  }

  const handleSelectTemplate = async (template: IBrandMarketingTemplate) => {
    try {
      setSelectedTemplate(template)
      onChangeTemplate(template)
      setIsTemplatesModalOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={classes.body}>
      <div className={classes.switch}>
        <div className={classes.switchContainer}>
          <span className={classes.switchTitle}>Automate Email</span>
          <Switch
            checked={isActive}
            onChange={handleActiveChange}
            color="primary"
            size="small"
          />
        </div>
        <p className={classes.switchDesc}>
          Send automate email to this contact and don’t miss any important date
          ever.
        </p>
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
              {selectedTemplate ? (
                <img
                  src={selectedTemplate?.preview.preview_url}
                  alt="Selected Template"
                />
              ) : (
                <span>Select a Template</span>
              )}
            </div>
          </div>
          <FormControl variant="outlined" className={classes.sendBefore}>
            <InputLabel id="trigger-send-before">Send</InputLabel>
            <Select
              labelId="trigger-send-before"
              id="trigger-send-before-select"
              value={sendBefore}
              onChange={handleSendBeforeChange}
              label="Send"
            >
              <MenuItem value={1}>1 day earlier</MenuItem>
              <MenuItem value={2}>2 day earlier</MenuItem>
              <MenuItem value={3}>3 day earlier</MenuItem>
              <MenuItem value={4}>4 day earlier</MenuItem>
            </Select>
          </FormControl>
        </>
      )}
      {isTemplatesModalOpen && (
        <MarketingTemplatePickerModal
          title="Select Template"
          user={user}
          mediums={['Email' as MarketingTemplateMedium.Email]}
          templateTypes={['Birthday', 'HomeAnniversary', 'WeddingAnniversary']}
          onSelect={handleSelectTemplate}
          onClose={() => setIsTemplatesModalOpen(false)}
        />
      )}
    </div>
  )
}
