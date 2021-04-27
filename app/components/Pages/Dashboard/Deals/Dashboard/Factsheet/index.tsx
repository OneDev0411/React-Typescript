import React from 'react'
import { useDispatch } from 'react-redux'

import { getValue } from 'models/Deal/helpers/dynamic-context'
import { getContext } from 'models/Deal/helpers/context/get-context'

import { upsertContexts, approveContext } from 'actions/deals'
import {
  getFactsheetSection,
  createUpsertObject
} from 'models/Deal/helpers/dynamic-context'

import { DateField } from './DateField'
import { TextField } from './TextField'

import { ContextField } from './types'

import { ItemsContainer, SectionTitle, TimelineSplitter } from './styled'

interface Props {
  deal: IDeal
  definitions?: unknown[]
  isBackOffice: boolean
  display?: boolean
  title?: string
  section: string
}

export default function Factsheet(props: Props) {
  const dispatch = useDispatch()

  const table =
    props.definitions ||
    getFactsheetSection(props.deal.id, props.deal, props.section)

  if (table.length === 0 || props.display === false) {
    return null
  }

  const saveContext = (field: ContextField, value: unknown) => {
    try {
      const context = createUpsertObject(
        props.deal,
        field.key,
        value,
        props.isBackOffice ? true : !field.needs_approval
      )

      dispatch(upsertContexts(props.deal.id, [context]))
    } catch (e) {
      console.log(e)
    }
  }

  const handleDeleteContext = async (field: ContextField) =>
    saveContext(field, null)

  const handleChangeContext = (field: ContextField, value: unknown): void => {
    const currentValue = getFieldValue(getValue(props.deal, field))

    const isValueChanged = value !== currentValue
    const isValid = value != null && field.validate(field, value)

    if (!isValueChanged || !isValid) {
      return
    }

    saveContext(field, value)
  }

  const handleApproveField = async (field: ContextField): Promise<void> => {
    if (!props.isBackOffice) {
      return
    }

    try {
      const context = getContext(props.deal, field.key)

      await dispatch(approveContext(props.deal.id, context.id))
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      {props.title && (
        <SectionTitle variant="body1">{props.title}</SectionTitle>
      )}

      <ItemsContainer>
        {props.section === 'Dates' && <TimelineSplitter />}

        {table.map(field => {
          const value = getFieldValue(getValue(props.deal, field))

          const sharedProps = {
            field,
            value,
            deal: props.deal,
            isBackOffice: props.isBackOffice,
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
    </div>
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
