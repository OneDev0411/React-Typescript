import React from 'react'
import { useTheme, Theme } from '@material-ui/core'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { propertyTypes } from 'deals/utils/property-types'

import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'

import { RadioGroup } from 'components/RadioGroup'

interface Props {
  onChange: (value: IDealPropertyType) => void
}

export function DealPropertyType({ onChange }: Props) {
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  const theme = useTheme<Theme>()

  const handleChange = (value: IDealPropertyType) => {
    onChange(value)

    if (wizard.currentStep === step) {
      wizard.next()
    }
  }

  return (
    <QuestionSection>
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
