import React, { Fragment, useState, useRef } from 'react'
import fecha from 'fecha'

import DealContext from 'models/Deal/helpers/dynamic-context'

import ActionButton from 'components/Button/ActionButton'
import DatePicker from 'components/DatePicker'

import { ContextInlineEdit } from 'deals/FormEdit/Editor/ContextInlineEdit'

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
                onChange={date =>
                  setContextValue(fecha.format(new Date(date), 'MMM D, YYYY'))
                }
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
            <ActionButton
              size="small"
              appearance="outline"
              onClick={() => handleSaveValue('TBD', false)}
            >
              TBD
            </ActionButton>

            <ActionButton
              size="small"
              appearance="outline"
              onClick={() => handleSaveValue('N/A', false)}
            >
              N/A
            </ActionButton>

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
