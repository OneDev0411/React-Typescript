import React, { Fragment, useState, useRef } from 'react'

import DealContext from 'models/Deal/helpers/dynamic-context'
import { getField } from 'models/Deal/helpers/context/get-field'

import ActionButton from 'components/Button/ActionButton'
import DatePicker from 'components/DatePicker'

import { ContextInlineEdit } from 'deals/FormEdit/Editor/ContextInlineEdit'

import { formatDate } from '../../../../utils/format-date'

import { TextInput } from './TextInput'
import { Body, Footer } from './styled'

export function ContextField(props) {
  const context = useRef(
    DealContext.searchContext(props.deal.brand.id, props.annotation.context)
  )

  const contextValue = getField(props.deal, props.annotation.context)

  const [isEditorOpen, setEditorStatus] = useState(false)
  const [fieldValue, setFieldValue] = useState(
    Object.values(props.values).join(' ')
  )

  const isValueSet = fieldValue || fieldValue === 0

  const getDate = () => {
    const date = new Date(fieldValue)

    return date instanceof Date && !isNaN(date) ? date : new Date()
  }

  const handleSaveValue = (value, updateContext) => {
    props.onSaveValue(context.current, value, updateContext)
    setEditorStatus(false)
  }

  return (
    <Fragment>
      <div
        style={{
          ...props.style,
          backgroundColor: props.value ? 'transparent' : '#d2e5f2'
        }}
        title={props.annotation.context}
        onClick={() => setEditorStatus(true)}
      >
        {props.value}
      </div>

      <ContextInlineEdit
        isOpen={isEditorOpen}
        bounds={props.rect}
        width={300}
        onDismiss={() => setEditorStatus(false)}
      >
        <Fragment>
          <Body>
            {context.current.data_type === 'Date' ? (
              <DatePicker
                onChange={date => setFieldValue(formatDate(date))}
                selectedDate={getDate()}
              />
            ) : (
              <TextInput
                context={context.current}
                defaultValue={fieldValue}
                onChange={e => setFieldValue(e.target.value)}
              />
            )}
          </Body>

          <Footer>
            {!contextValue &&
              ['TBD', 'N/A'].map((value, index) => (
                <ActionButton
                  key={index}
                  size="small"
                  appearance="outline"
                  onClick={() => handleSaveValue(value, false)}
                >
                  {value}
                </ActionButton>
              ))}

            <ActionButton
              size="small"
              disabled={!isValueSet}
              onClick={() => handleSaveValue(fieldValue)}
            >
              Save
            </ActionButton>
          </Footer>
        </Fragment>
      </ContextInlineEdit>
    </Fragment>
  )
}
