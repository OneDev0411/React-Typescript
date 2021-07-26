import React from 'react'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'
import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'
import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import { RadioGroup } from 'components/RadioGroup'

interface Props {
  propertyType?: IDealPropertyType
  onChange: (value: IDealType) => void
}

export function DealType({ propertyType, onChange }: Props) {
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  const handleChange = (value: IDealType) => {
    onChange(value)

    if (wizard.currentStep === step) {
      wizard.next()
    } else {
      wizard.setStep(step + 1)
    }
  }

  return (
    <QuestionSection>
      <QuestionTitle>Which side are you representing?</QuestionTitle>
      <QuestionForm>
        <RadioGroup
          name="DealType"
          options={[
            {
              label: propertyType?.is_lease ? 'Tenant' : 'Buyer',
              value: 'Buying'
            },
            {
              label: propertyType?.is_lease ? 'Landlord' : 'Seller',
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
