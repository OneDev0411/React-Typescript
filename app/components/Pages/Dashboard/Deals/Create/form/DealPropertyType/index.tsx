import React from 'react'
import { useTheme, Theme } from '@material-ui/core'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { propertyTypes } from 'deals/utils/property-types'

import { useWizardForm } from 'components/QuestionWizard/use-context'
import { RadioGroup } from 'components/RadioGroup'

import { useFormContext } from '../../context/use-form-context'

interface Props {
  step?: number
}

export function DealPropertyType({ step }: Props) {
  const wizard = useWizardForm()
  const context = useFormContext()
  const theme = useTheme<Theme>()

  const handleChange = (value: IDealPropertyType) => {
    if (wizard.currentStep === step) {
      wizard.next()
    }

    context.updateForm({
      propertyType: value
    })
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>What is the property type?</QuestionTitle>
      <QuestionForm>
        <RadioGroup
          name="DealPropertyType"
          options={propertyTypes.map(propertyType => ({
            value: propertyType,
            label: propertyType
          }))}
          style={{
            display: 'flex',
            flexWrap: 'wrap'
          }}
          groupStyle={{
            width: `calc(50% - ${theme.spacing(1)}px)`,
            margin: theme.spacing(0, 1, 1, 0)
          }}
          onChange={handleChange}
        />
      </QuestionForm>
    </QuestionSection>
  )
}
