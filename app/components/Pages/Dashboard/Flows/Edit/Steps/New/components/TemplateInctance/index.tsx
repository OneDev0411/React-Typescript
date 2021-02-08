import React from 'react'
import { Field } from 'react-final-form'

import { TemplateSelector } from './Selector'

export const TemplateInctance = () => {
  return (
    <Field
      name="marketing_email"
      label="marketing_email"
      render={({ input: { onChange, value } }) => <TemplateSelector />}
    />
  )
}
