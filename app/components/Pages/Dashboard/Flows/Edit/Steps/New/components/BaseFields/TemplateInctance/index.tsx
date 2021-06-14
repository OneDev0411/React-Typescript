import React from 'react'
import { Field } from 'react-final-form'
import { Typography } from '@material-ui/core'

import { TemplateSelector } from './Selector'

interface Props {
  disabled?: boolean
  currentBrandTemplate?: Nullable<IBrandMarketingTemplate>
  currentTemplateInstance?: Nullable<IMarketingTemplateInstance>
}

export const TemplateInctance = ({
  disabled = false,
  currentBrandTemplate = null,
  currentTemplateInstance = null
}: Props) => {
  const handleValidation = value => {
    if (value) {
      return
    }

    return 'No Template selected'
  }

  return (
    <Field
      name="template"
      label="template"
      validate={handleValidation}
      render={({ input: { onChange, value }, meta }) => {
        const showError = Boolean(meta.submitFailed && meta.error)

        return (
          <>
            <TemplateSelector
              disabled={disabled}
              currentBrandTemplate={currentBrandTemplate}
              currentTemplateInstance={currentTemplateInstance}
              onChange={onChange}
            />
            {showError && (
              <Typography variant="body2" color="error">
                {meta.error}
              </Typography>
            )}
          </>
        )
      }}
    />
  )
}
