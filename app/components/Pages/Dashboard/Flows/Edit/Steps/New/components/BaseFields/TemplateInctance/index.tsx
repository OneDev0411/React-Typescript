import React from 'react'
import { Field } from 'react-final-form'

import { TemplateSelector } from './Selector'

interface Props {
  currentBrandTemplate?: Nullable<IBrandMarketingTemplate>
  currentTemplateInstance?: Nullable<IMarketingTemplateInstance>
}

export const TemplateInctance = ({
  currentBrandTemplate = null,
  currentTemplateInstance = null
}: Props) => {
  return (
    <Field
      name="template"
      label="template"
      render={({ input: { onChange, value } }) => (
        <TemplateSelector
          value={value}
          currentBrandTemplate={currentBrandTemplate}
          currentTemplateInstance={currentTemplateInstance}
          onChange={onChange}
        />
      )}
    />
  )
}
