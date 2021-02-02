import React from 'react'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { useBrandPropertyTypes } from 'hooks/use-get-brand-property-types'
import { getActiveTeamId } from 'utils/user-teams'

import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'

import { RadioGroup } from 'components/RadioGroup'

import { useCreationContext } from '../../context/use-creation-context'

interface Props {
  onChange: (value: UUID) => void
}

export function DealPropertyType({ onChange }: Props) {
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { deal, user } = useCreationContext()

  const propertyTypes = useBrandPropertyTypes(getActiveTeamId(user)!)

  const handleChange = (value: UUID) => {
    onChange(value)

    if (wizard.currentStep === step) {
      wizard.next()
    }
  }

  return (
    <QuestionSection disabled={!!deal}>
      <QuestionTitle>What is the property type?</QuestionTitle>
      <QuestionForm>
        <RadioGroup
          name="DealPropertyType"
          options={propertyTypes.map(item => ({
            value: item.id,
            label: item.label
          }))}
          onChange={handleChange}
        />
      </QuestionForm>
    </QuestionSection>
  )
}
