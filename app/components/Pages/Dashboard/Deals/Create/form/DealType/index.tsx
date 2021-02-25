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
    <QuestionSection
      disabled={!!deal}
      disableMessage="You need to discard the form to be able edit the side"
    >
      <QuestionTitle>Which side are you representing?</QuestionTitle>
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
            },
            {
              label: 'Both',
              value: 'Both'
            }
          ]}
          onChange={handleChange}
        />
      </QuestionForm>
    </QuestionSection>
  )
}
