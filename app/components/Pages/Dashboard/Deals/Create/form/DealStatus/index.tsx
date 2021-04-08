import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { useDispatch } from 'react-redux'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { upsertContexts } from 'actions/deals'

import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'

import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'

import DealContext from 'models/Deal/helpers/dynamic-context'

import { useCreationContext } from 'deals/Create/context/use-creation-context'

import { RadioGroup } from 'components/RadioGroup'

import { getStatus } from 'models/Deal/helpers/context'

interface Props {
  list: IDealStatus[]
  onChange?: (value: string) => void
}

export function DealStatus({ list, onChange }: Props) {
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { deal } = useCreationContext()
  const status = deal ? getStatus(deal) : null

  const dispatch = useDispatch()

  const handleChange = (value: string) => {
    if (onChange) {
      onChange(value)
    }

    if (deal && !onChange) {
      dispatch(
        upsertContexts(deal.id, [
          DealContext.createUpsertObject(
            deal,
            DealContext.getStatusField(deal),
            value,
            true
          )
        ])
      )
    }

    if (wizard.currentStep === step) {
      wizard.next()
    }
  }

  if (wizard.lastVisitedStep < step) {
    return null
  }

  return (
    <QuestionSection>
      <QuestionTitle>What is the status of the deal?</QuestionTitle>

      <QuestionForm>
        {list.length === 0 && <CircularProgress />}
        <RadioGroup
          name="DealType"
          defaultValue={status}
          options={list.map(status => ({
            label: status.label,
            value: status.label
          }))}
          onChange={handleChange}
        />
      </QuestionForm>
    </QuestionSection>
  )
}
