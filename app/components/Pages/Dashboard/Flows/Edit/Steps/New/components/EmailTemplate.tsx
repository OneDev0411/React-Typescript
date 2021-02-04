import React, { useMemo, ChangeEvent } from 'react'
import { Field } from 'react-final-form'
import {
  Box,
  Button,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@material-ui/core'

interface Props {
  templates: IBrandEmailTemplate[]
  currentTemplateId?: Nullable<UUID>
  disabled: boolean
  onNewTemplateClick: () => void
  onReviewTemplateClick: (template: IBrandEmailTemplate) => void
}

export const EmailTemplate = ({
  templates,
  currentTemplateId,
  disabled,
  onNewTemplateClick,
  onReviewTemplateClick
}: Props) => {
  const emailTemplates = useMemo(() => {
    return [
      {
        label: 'Select a template',
        value: 0
      },
      ...templates.map(template => ({
        label: template.name,
        value: template.id
      }))
    ]
  }, [templates])

  const selectedItem = useMemo(() => {
    const defaultValue = emailTemplates[0]

    if (currentTemplateId) {
      const template = emailTemplates.find(
        item => item.value === currentTemplateId
      )

      return template || defaultValue
    }

    return defaultValue
  }, [currentTemplateId, emailTemplates])

  const handleValidation = value => {
    if (value) {
      return
    }

    return 'No email template selected'
  }

  const handleReviewTemplate = e => {
    e.stopPropagation()

    const selectedTemplate = templates.find(
      ({ id }) => id === currentTemplateId
    )

    if (!selectedTemplate) {
      return
    }

    onReviewTemplateClick(selectedTemplate)
  }

  return (
    <Box>
      <Field
        isRequired
        name="email_template"
        label="Email Template"
        text="Select an email template"
        items={emailTemplates}
        validate={handleValidation}
        render={({ input: { name, onChange, value }, meta }) => {
          const showError = Boolean(meta.submitFailed && meta.error)

          return (
            <FormControl variant="outlined" size="small" error={showError}>
              <InputLabel id="email_template">Template</InputLabel>
              <Select
                labelId="email_template"
                id="email_template-select"
                name={name}
                value={selectedItem.value}
                onChange={(event: ChangeEvent<{ value: string | number }>) => {
                  const value = event.target.value

                  onChange(value)
                }}
                label="Template"
              >
                {emailTemplates.map(item => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
              {showError && (
                <FormHelperText variant="standard">{meta.error}</FormHelperText>
              )}
            </FormControl>
          )
        }}
      />
      {Boolean(currentTemplateId) && (
        <Tooltip title="Review or edit selected email template">
          <Button
            variant="text"
            color="primary"
            disabled={disabled}
            onClick={handleReviewTemplate}
          >
            Review
          </Button>
        </Tooltip>
      )}
      <Button
        variant="text"
        color="primary"
        disabled={disabled}
        onClick={event => {
          event.stopPropagation()
          onNewTemplateClick()
        }}
      >
        Create a New Email Template
      </Button>
    </Box>
  )
}
