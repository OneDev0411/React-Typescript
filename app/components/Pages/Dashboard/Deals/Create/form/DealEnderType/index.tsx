import React from 'react'
import { useDispatch } from 'react-redux'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'

import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'

import { RadioGroup } from 'components/RadioGroup'

import { createUpsertObject } from 'models/Deal/helpers/dynamic-context'
import { upsertContexts } from 'actions/deals'

import { useCreationContext } from '../../context/use-creation-context'

interface Props {
  onChange: (value: IDealEnderType) => void
}

export function DealEnderType({ onChange }: Props) {
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { deal } = useCreationContext()

  const dispatch = useDispatch()

  const handleChange = (value: IDealEnderType) => {
    if (deal) {
      const data = createUpsertObject(deal, 'ender_type', value, false)

      dispatch(upsertContexts(deal!.id, [data]))
    } else {
      onChange(value)
    }

    if (wizard.currentStep === step) {
      wizard.next()
    }
  }

  return (
    <QuestionSection>
      <QuestionTitle>
        Is another agent from your office on the other side of this deal?
      </QuestionTitle>
      <QuestionForm>
        <RadioGroup
          name="DealType"
          options={[
            {
              label: 'No',
              value: null
            },
            {
              label: 'Yes',
              value: 'OfficeDoubleEnder'
            }
          ]}
          onChange={handleChange}
        />
      </QuestionForm>
    </QuestionSection>
  )
}
