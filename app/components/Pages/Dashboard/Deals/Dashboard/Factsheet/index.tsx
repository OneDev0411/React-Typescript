import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getValue } from 'models/Deal/helpers/dynamic-context'
import { getContext } from 'models/Deal/helpers/context/get-context'

import { upsertContexts, approveContext } from 'actions/deals'
import {
  validate,
  createUpsertObject
} from 'models/Deal/helpers/dynamic-context'

import { IAppState } from 'reducers'

import { getDealChecklists } from 'reducers/deals/checklists'

import { useFactsheetContexts } from './hooks/use-factsheet-contexts'

import { DateField } from './DateField'
import { TextField } from './TextField'

import {
  Container,
  ItemsContainer,
  SectionTitle,
  FactsheetDivider,
  TimelineSplitter
} from './styled'

interface Props {
  deal: IDeal
  definitions?: IDealBrandContext[]
  isBackOffice: boolean
  display?: boolean
  title?: string
  section: string
  showDivider: boolean
}

export default function Factsheet({
  deal,
  definitions,
  isBackOffice,
  display,
  title,
  section,
  showDivider
}: Props) {
  const dispatch = useDispatch()

  const contexts = useFactsheetContexts(deal, section)
  const table = definitions || contexts

  const checklists = useSelector<IAppState, IDealChecklist[]>(state =>
    getDealChecklists(deal, state.deals.checklists)
  )

  if (table.length === 0 || display === false) {
    return null
  }

  const saveContext = (field: IDealBrandContext, value: unknown) => {
    const checklistType = deal.has_active_offer ? 'Offer' : deal.deal_type

    try {
      const context = createUpsertObject(
        deal,
        checklists,
        checklistType,
        field.key,
        value,
        isBackOffice ? true : !field.needs_approval
      )

      dispatch(upsertContexts(deal.id, [context]))
    } catch (e) {
      console.log(e)
    }
  }

  const handleDeleteContext = async (field: IDealBrandContext) => {
    saveContext(field, null)
  }

  const handleChangeContext = (
    field: IDealBrandContext,
    value: unknown
  ): void => {
    const currentValue = getFieldValue(getValue(deal, field))

    const isValueChanged = value !== currentValue
    const isValid = value != null && validate(field, value)

    if (!isValueChanged || !isValid) {
      return
    }

    saveContext(field, value)
  }

  const handleApproveField = async (
    field: IDealBrandContext
  ): Promise<void> => {
    if (!isBackOffice) {
      return
    }

    try {
      const context = getContext(deal, field.key)

      await dispatch(approveContext(deal.id, context.id))
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <Container>
        {title && <SectionTitle>{title}</SectionTitle>}

        <ItemsContainer>
          {section === 'Dates' && <TimelineSplitter />}

          {table.map((field, index) => {
            const value = getFieldValue(getValue(deal, field))

            const sharedProps = {
              field,
              value,
              deal,
              isBackOffice,
              onChange: handleChangeContext,
              onDelete: handleDeleteContext,
              onApprove: handleApproveField
            }

            if (field.data_type === 'Date') {
              return <DateField key={field.key} {...sharedProps} />
            }

            return <TextField key={field.key} {...sharedProps} />
          })}
        </ItemsContainer>
      </Container>

      {showDivider && <FactsheetDivider />}
    </>
  )
}

function getFieldValue(valueObject) {
  if (valueObject.rawValue != null) {
    return valueObject.rawValue.toString()
  }

  if (valueObject.value != null) {
    return valueObject.value.toString()
  }

  return ''
}
