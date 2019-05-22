import React, { Fragment, useState, useRef } from 'react'

import DealContext from 'models/Deal/helpers/dynamic-context'

import ActionButton from 'components/Button/ActionButton'
import DatePicker from 'components/DatePicker'

import { ContextInlineEdit } from 'deals/FormEdit/Editor/ContextInlineEdit'

import { formatDate } from '../../../../utils/format-date'
import { contextOverwriteValues } from '../../../../utils/context-overwrite-values'

import { TextInput } from './TextInput'
import { Body, Footer } from './styled'

export function ContextField(props) {
  const context = useRef(
    DealContext.searchContext(props.deal.brand.id, props.annotation.context)
  )

  const [isEditorOpen, setEditorStatus] = useState(false)
  const [contextValue, setContextValue] = useState(
    Object.values(props.values).join(' ')
  )

  const getDate = () => {
    const date = new Date(contextValue)

    return date instanceof Date && !isNaN(date) ? date : new Date()
  }

  const handleSaveValue = (value, updateContext) => {
    props.onSaveValue(context.current, value, updateContext)
    setEditorStatus(false)
  }

  return (
    <Fragment>
      <div
        style={props.style}
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
                showTodayButton={false}
                onChange={date => setContextValue(formatDate(date))}
                selectedDate={getDate()}
              />
            ) : (
              <TextInput
                context={context.current}
                defaultValue={contextValue}
                onChange={e => setContextValue(e.target.value)}
              />
            )}
          </Body>

          <Footer>
            {contextOverwriteValues.map((value, index) => (
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
              onClick={() => handleSaveValue(contextValue)}
            >
              Save
            </ActionButton>
          </Footer>
        </Fragment>
      </ContextInlineEdit>
    </Fragment>
  )
}
