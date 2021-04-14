import { CircularProgress } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { upsertContexts } from 'actions/deals'

import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'

import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'

import { createContextObject } from 'models/Deal/helpers/brand-context/create-context-object'

import { useCreationContext } from 'deals/Create/context/use-creation-context'

import { RadioGroup } from 'components/RadioGroup'

import { getStatus } from 'models/Deal/helpers/context'
import { IAppState } from 'reducers'
import { getDealChecklists } from 'reducers/deals/checklists'
import { getStatusContextKey } from 'models/Deal/helpers/brand-context/get-status-field'

interface Props {
  list: IDealStatus[]
  onChange?: (value: string) => void
}

export function DealStatus({ list, onChange }: Props) {
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { deal } = useCreationContext()
  const status = deal ? getStatus(deal) : null

  const checklists = useSelector<IAppState, IDealChecklist[]>(state =>
    getDealChecklists(deal, state.deals.checklists)
  )

  const dispatch = useDispatch()

  const handleChange = (value: string) => {
    if (onChange) {
      onChange(value)
    }

    if (deal && !onChange) {
      dispatch(
        upsertContexts(deal.id, [
          createContextObject(
            deal,
            checklists,
            deal.has_active_offer ? 'Offer' : deal.deal_type,
            getStatusContextKey(deal),
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
