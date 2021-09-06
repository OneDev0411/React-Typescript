import React from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { upsertContexts, approveContext } from 'actions/deals'
import { createContextObject } from 'models/Deal/helpers/brand-context/create-context-object'
import { isRequiredContext } from 'models/Deal/helpers/brand-context/is-required-context'
import { getContext } from 'models/Deal/helpers/context/get-context'
import { getContextValue } from 'models/Deal/helpers/context/get-context-value'
import { validateContext } from 'models/Deal/helpers/context/validate-context'
import { IAppState } from 'reducers'
import { getBrandChecklistsById } from 'reducers/deals/brand-checklists'
import { getDealChecklists } from 'reducers/deals/checklists'

import { DateField } from './DateField'
import { isContextApproved } from './helpers/is-context-approved'
import { useFactsheetContexts } from './hooks/use-factsheet-contexts'
import { ItemsContainer, SectionTitle, TimelineSplitter } from './styled'
import { TextField } from './TextField'

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

      if (context) {
        await dispatch(approveContext(deal.id, context.id))
      }
    } catch (e) {
      console.log(e)
    }
  }

  const getTooltipTitle = (
    brandContext: IDealBrandContext,
    dealContext: Nullable<IDealContext>,
    isDisabledByMls: boolean
  ) => {
    if (isDisabledByMls) {
      return (
        <div>
          <b>{brandContext.label}</b> can only be changed on MLS. Once changed,
          the update will be reflected here.
        </div>
      )
    }

    if (
      dealContext?.id &&
      !isContextApproved(deal, brandContext) &&
      !isBackOffice
    ) {
      return 'Pending Office Approval'
    }

    return ''
  }

  return (
    <>
      {title && <SectionTitle>{title}</SectionTitle>}

      <ItemsContainer>
        {section === 'Dates' && <TimelineSplitter />}

        {table.map((brandContext, index) => {
          const dealContext = getContext(deal, brandContext.key)
          const value = getFieldValue(getContextValue(deal, brandContext))
          const hasMlsValue =
            value != null &&
            value !== '' &&
            deal.context[brandContext.key]?.source === 'MLS'

          const isDisabledByMls = !!(
            deal.listing &&
            brandContext.preffered_source === 'MLS' &&
            hasMlsValue
          )

          const sharedProps = {
            index,
            total: table.length - 1,
            brandContext,
            dealContext,
            value,
            deal,
            isBackOffice,
            isDisabled: disableEditing || isDisabledByMls,
            tooltip: getTooltipTitle(
              brandContext,
              dealContext,
              isDisabledByMls
            ),
            onChange: handleChangeContext,
            onDelete: handleDeleteContext,
            onApprove: handleApproveField
          }

          if (brandContext.data_type === 'Date') {
            return <DateField key={brandContext.key} {...sharedProps} />
          }

          return <TextField key={brandContext.key} {...sharedProps} />
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
