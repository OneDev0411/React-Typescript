import { Box, Typography } from '@material-ui/core'
import { Field } from 'react-final-form'

import { TemplateSelector } from './Selector'

interface Props {
  disabled?: boolean
  currentBrandTemplate?: Nullable<IBrandMarketingTemplate>
  currentTemplateInstance?: Nullable<IMarketingTemplateInstance>
}

export const TemplateInctance = ({
  disabled = false,
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
              templateType={['Birthday']}
              hasError={showError}
              currentTemplateInstance={currentTemplateInstance}
              onChange={onChange}
            />
            {showError && (
              <Box mt={0.5}>
                <Typography variant="body2" color="error">
                  {meta.error}
                </Typography>
              </Box>
            )}
          </>
        )
      }}
    />
  )
}
