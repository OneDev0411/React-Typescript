import React from 'react'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'

import { RadioGroup } from 'components/RadioGroup'

import { useCreationContext } from '../../context/use-creation-context'

interface Props {
  propertyType: IDealPropertyType
  onChange: (value: IDealType) => void
}

export function DealType({ propertyType, onChange }: Props) {
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { deal } = useCreationContext()

  const handleChange = (value: IDealType) => {
    onChange(value)

    if (wizard.currentStep === step) {
      wizard.next()
    }
  }

  return (
    <QuestionSection hidden={!!deal}>
      <QuestionTitle>Who are you repersenting?</QuestionTitle>
      <QuestionForm>
        <RadioGroup
          name="DealType"
          options={[
            {
              label: propertyType?.includes('Lease') ? 'Tenant' : 'Buyer',
              value: 'Buying'
            },
            {
              label: propertyType?.includes('Lease') ? 'Landlord' : 'Seller',
              value: 'Selling'
            }
          ]}
          onChange={handleChange}
        />
      </QuestionForm>
    </QuestionSection>
  )
}
