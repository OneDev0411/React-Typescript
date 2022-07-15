import { useState, useRef } from 'react'

import { Button } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { ToWords } from 'to-words'

import DatePicker from 'components/DatePicker'
import { ContextInlineEdit } from 'deals/FormEdit/Editor/ContextInlineEdit'
import { searchContext } from 'models/Deal/helpers/brand-context/search-context'
import { getField } from 'models/Deal/helpers/context/get-field'
import { getBrandChecklistsById } from 'reducers/deals/brand-checklists'
import { isValidDate } from 'utils/date-times/is-valid-date'

import { UnlinkFieldButton } from '../../../../components/UnlinkFieldButton'
import { formatDate } from '../../../../utils/format-date'

import { Body, Footer } from './styled'
import { TextInput } from './TextInput'

const toWords = new ToWords({
  localeCode: 'en-US',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: true
  }
})

export function ContextField(props) {
  const box = props.rect

  const brandChecklists = useSelector(({ deals }) =>
    getBrandChecklistsById(deals.brandChecklists, props.deal.brand.id)
  )

  const context = useRef(
    searchContext(props.deal, brandChecklists, props.annotation.context)
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

  const formatValue = () => {
    if (props.annotation.format === 'NumeralCurrency' && props.value) {
      return toWords.convert(Number(props.value.replace(/[^0-9.-]+/g, '')))
    }

    if (context.current?.data_type === 'Date' && props.value) {
      return isValidDate(new Date(props.value))
        ? formatDate(props.value, props.annotation.format)
        : props.value
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
        className="field-unlinkable"
        title={props.annotation.context}
        onClick={() => setEditorStatus(true)}
      >
        {formatValue()}
      </div>

      <UnlinkFieldButton
        style={{
          left: `${box.left + box.width - 16}px`,
          top: `${box.top + box.height / 10}px`,
          height: `${box.height}px`
        }}
        onClick={props.onToggleUnlink}
      />

      <ContextInlineEdit
        isOpen={isEditorOpen}
        bounds={box}
        width={300}
        onDismiss={() => setEditorStatus(false)}
      >
        <>
          <Body>
            {context.current?.data_type === 'Date' ? (
              <DatePicker
                onChange={value => setFieldValue(formatDate(value))}
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
