import React from 'react'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { propertyTypes } from 'deals/utils/property-types'

import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'

import { RadioGroup } from 'components/RadioGroup'

import { useCreationContext } from '../../context/use-creation-context'

interface Props {
  onChange: (value: IDealPropertyType) => void
}

export function DealPropertyType({ onChange }: Props) {
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { deal } = useCreationContext()

  const handleChange = (value: IDealPropertyType) => {
    onChange(value)

    if (wizard.currentStep === step) {
      wizard.next()
    }
  }

  return (
    <QuestionSection
      disabled={!!deal}
      disableMessage="You need to discard the form to be able edit the property"
    >
      <QuestionTitle>What type of property is this?</QuestionTitle>
      <QuestionForm>
        <RadioGroup
          name="DealPropertyType"
          options={propertyTypes.map(propertyType => ({
            value: propertyType,
            label: propertyType
          }))}
          onChange={handleChange}
        />
      </QuestionForm>
    </QuestionSection>
  )
}
