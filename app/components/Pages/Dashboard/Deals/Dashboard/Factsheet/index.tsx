import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { upsertContexts, approveContext } from 'actions/deals'

import { getContext } from 'models/Deal/helpers/context/get-context'
import { getContextValue } from 'models/Deal/helpers/context/get-context-value'
import { createContextObject } from 'models/Deal/helpers/brand-context/create-context-object'
import { validateContext } from 'models/Deal/helpers/context/validate-context'

import { IAppState } from 'reducers'

import { getDealChecklists } from 'reducers/deals/checklists'

import { isRequiredContext } from 'models/Deal/helpers/brand-context/is-required-context'

import { getBrandChecklistsById } from 'reducers/deals/brand-checklists'

import { useFactsheetContexts } from './hooks/use-factsheet-contexts'

import { DateField } from './DateField'
import { TextField } from './TextField'

import { ItemsContainer, SectionTitle, TimelineSplitter } from './styled'
import { isContextApproved } from './helpers/is-context-approved'

interface Props {
  deal: IDeal
  contexts?: IDealBrandContext[]
  isBackOffice: boolean
  display?: boolean
  title?: React.ReactText | React.ReactNode
  section: string
  disableEditing?: boolean
}

export default function Factsheet({
  deal,
  contexts,
  isBackOffice,
  display,
  title,
  section,
  disableEditing = false
}: Props) {
  const dispatch = useDispatch()

  const contextsList = useFactsheetContexts(deal, section)
  const table = contexts ?? contextsList

  const { checklists, brandChecklists } = useSelector(
    ({ deals }: IAppState) => ({
      brandChecklists: deal
        ? getBrandChecklistsById(deals.brandChecklists, deal.brand.id)
        : [],
      checklists: getDealChecklists(deal, deals.checklists)
    })
  )

  if (table.length === 0 || display === false) {
    return null
  }

  const saveContext = (field: IDealBrandContext, value: unknown) => {
    try {
      const context = createContextObject(
        deal,
        brandChecklists,
        checklists,
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
    const currentValue = getFieldValue(getContextValue(deal, field))

    const isValueChanged = value !== currentValue
    const isValid =
      value != null &&
      validateContext(
        field,
        value as string,
        isRequiredContext(deal, brandChecklists, field.key)!
      )

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

  const getTooltipTitle = (context: IDealBrandContext, isDisabledByMls) => {
    if (isDisabledByMls) {
      return (
        <div>
          <b>{context.label}</b> can only be changed on MLS. Once changed, the
          update will be reflected here.
        </div>
      )
    }

    if (!isContextApproved(deal, context) && !isBackOffice) {
      return 'Pending Office Approval'
    }

    return ''
  }

  return (
    <>
      {title && <SectionTitle>{title}</SectionTitle>}

      <ItemsContainer>
        {section === 'Dates' && <TimelineSplitter />}

        {table.map((context, index) => {
          const value = getFieldValue(getContextValue(deal, context))
          const hasMlsValue =
            value != null &&
            value !== '' &&
            deal.context[context.key]?.source === 'MLS'

          const isDisabledByMls = !!(
            deal.listing &&
            context.preffered_source === 'MLS' &&
            hasMlsValue
          )

          const sharedProps = {
            index,
            total: table.length - 1,
            field: context,
            value,
            deal,
            isBackOffice,
            isDisabled: isDisabledByMls,
            tooltip: getTooltipTitle(context, isDisabledByMls),
            onChange: handleChangeContext,
            onDelete: handleDeleteContext,
            onApprove: handleApproveField
          }

          if (context.data_type === 'Date') {
            return <DateField key={context.key} {...sharedProps} />
          }

          return <TextField key={context.key} {...sharedProps} />
        })}
      </ItemsContainer>
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
