import React, { useState, useRef } from 'react'

import { Button } from '@material-ui/core'

import DealContext from 'models/Deal/helpers/dynamic-context'
import { getField } from 'models/Deal/helpers/context/get-field'

import DatePicker from 'components/DatePicker'

import { ContextInlineEdit } from 'deals/FormEdit/Editor/ContextInlineEdit'

import { formatDate } from '../../../../utils/format-date'

import { TextInput } from './TextInput'
import { Body, Footer } from './styled'

export function ContextField(props) {
  const context = useRef(
    DealContext.searchContext(props.deal.id, props.annotation.context)
  )

  const contextValue = getField(props.deal, props.annotation.context)

  const [isEditorOpen, setEditorStatus] = useState(false)
  const [fieldValue, setFieldValue] = useState(
    Object.values(props.values).join(' ')
  )

  const isValueSet = fieldValue || fieldValue === 0

  const getDate = () => {
    const date = new Date(fieldValue || new Date())

    // eslint-disable-next-line no-restricted-globals
    return date instanceof Date && !isNaN(date) ? date : new Date()
  }

  const handleSaveValue = (value, updateContext) => {
    props.onSaveValue(context.current, value, updateContext)
    setEditorStatus(false)
  }

  const normalizeValue = () => {
    if (context.current.data_type === 'Date' && props.value) {
      return formatDate(props.value, props.annotation.format)
    }

    return props.value
  }

  return (
    <>
      <div
        style={{
          ...props.style,
          backgroundColor: props.value ? 'transparent' : '#d2e5f2'
        }}
        title={props.annotation.context}
        onClick={() => setEditorStatus(true)}
      >
        {normalizeValue()}
      </div>

      <ContextInlineEdit
        isOpen={isEditorOpen}
        bounds={props.rect}
        width={300}
        onDismiss={() => setEditorStatus(false)}
      >
        <>
          <Body>
            {context.current.data_type === 'Date' ? (
              <DatePicker onChange={setFieldValue} selectedDate={getDate()} />
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
                <Button
                  key={index}
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleSaveValue(value, false)}
                >
                  {value}
                </Button>
              ))}

            <Button
              size="small"
              variant="contained"
              color="secondary"
              disabled={!isValueSet}
              onClick={() => handleSaveValue(fieldValue)}
            >
              Save
            </Button>
          </Footer>
        </>
      </ContextInlineEdit>
    </>
  )
}
