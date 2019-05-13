import React, { Fragment, useState, useRef, useMemo } from 'react'

import DealContext from 'models/Deal/helpers/dynamic-context'

import ActionButton from 'components/Button/ActionButton'
import DatePicker from 'components/DatePicker'

import { ContextInlineEdit } from '../../../ContextInlineEdit'

import { TextInput } from './TextInput'
import { Body, Footer } from './styled'

export function ContextField(props) {
  const context = useRef(
    DealContext.searchContext(props.deal.brand.id, props.annotation.context)
  )
  const [isEditorOpen, toggleEditor] = useState(false)
  const [contextValue, setContextValue] = useState(
    Object.values(props.values).join(' ')
  )
  const toggle = () => toggleEditor(!isEditorOpen)

  const handleChangeValue = value => {
    setContextValue(value)
  }

  return (
    <Fragment>
      <div
        style={{
          ...props.style,
          cursor: 'pointer',
          background: 'red'
        }}
        onClick={toggle}
      >
        {props.value}
      </div>

      {isEditorOpen && (
        <ContextInlineEdit bounds={props.rect} width={300} onDismiss={toggle}>
          <Fragment>
            <Body>
              {context.current.data_type === 'Date' ? (
                <DatePicker
                  showTodayButton={false}
                  onChange={handleChangeValue}
                  selectedDate={new Date(props.value)}
                />
              ) : (
                <TextInput
                  context={context.current}
                  defaultValue={contextValue}
                  onChange={handleChangeValue}
                />
              )}
            </Body>

            <Footer>
              <ActionButton
                size="small"
                appearance="outline"
                onClick={() => props.onSaveValue('TBD', false)}
              >
                TBD
              </ActionButton>

              <ActionButton
                size="small"
                appearance="outline"
                onClick={() => props.onSaveValue('N/A', false)}
              >
                N/A
              </ActionButton>

              <ActionButton
                size="small"
                onClick={() => props.onSaveValue(contextValue)}
              >
                Save
              </ActionButton>
            </Footer>
          </Fragment>
        </ContextInlineEdit>
      )}
    </Fragment>
  )
}
