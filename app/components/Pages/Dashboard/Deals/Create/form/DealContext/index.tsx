import React, { useState, useEffect } from 'react'
import {
  Button,
  Box,
  makeStyles,
  TextField,
  InputAdornment,
  Theme
} from '@material-ui/core'
import fecha from 'fecha'
import { useDispatch } from 'react-redux'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import { createUpsertObject } from 'models/Deal/helpers/dynamic-context'
import { upsertContexts } from 'actions/deals'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import DatePicker from 'components/DatePicker'
import { MaskedInput } from 'components/MaskedInput'

import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'

import { getField } from 'models/Deal/helpers/context'

import { useCreationContext } from '../../context/use-creation-context'

interface Props {
  context: IDealBrandContext
  onChange: (value: string | number) => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    label: {
      color: theme.palette.primary.main
    },
    saveButton: {
      marginTop: theme.spacing(2)
    }
  }),
  {
    name: 'CreateDeal-Context'
  }
)

export function DealContext({ context, onChange }: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { deal } = useCreationContext()

  const defaultValue = deal ? getField(deal, context.key) : ''

  const [inputValue, setInputValue] = useState(defaultValue)

  const contextType = context.data_type

  useEffect(() => {
    if (defaultValue && !inputValue) {
      setInputValue(defaultValue)
    }
    // eslint-disable-next-line
  }, [defaultValue])

  const getContextDate = () => {
    if (!inputValue) {
      return new Date()
    }

    if (typeof inputValue === 'number') {
      return new Date(inputValue * 1000)
    }

    return new Date(inputValue)
  }

  const handleSelectDate = (date: Date, type: 'day' | 'month' | 'year') => {
    if (type !== 'day') {
      return
    }

    setInputValue(date)

    const value = fecha.format(date, 'YYYY-MM-DD')

    handleSave(value)
  }

  const handleChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = e.target.value
    const value = maskedValue
      ? parseFloat(maskedValue.replace('$', '').replace(/\,/gi, ''))
      : ''

    setInputValue(value.toString())
  }

  const handleSave = (value = inputValue) => {
    if (deal) {
      try {
        const data = createUpsertObject(deal, context.key, value, false)

        dispatch(upsertContexts(deal!.id, [data]))
      } catch (e) {
        console.log(e)
      }
    } else {
      onChange(value)
    }

    if (wizard.currentStep === step) {
      wizard.next()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      handleSave()
    }
  }

  const getMask = () => {
    if (context.properties?.mask) {
      return context.properties.mask
    }

    if (context.format === 'Currency') {
      return createNumberMask({
        prefix: '',
        allowNegative: false,
        allowLeadingZeroes: true,
        allowDecimal: true
      })
    }

    if (contextType === 'Number') {
      return createNumberMask({
        prefix: '',
        allowNegative: true,
        allowLeadingZeroes: false,
        allowDecimal: true
      })
    }

    return []
  }

  if (wizard.lastVisitedStep < step) {
    return null
  }

  return (
    <QuestionSection>
      <QuestionTitle>
        {contextType === 'Date' ? 'When' : 'What'} is the{' '}
        <span className={classes.label}>{context.label}</span> for this deal?
      </QuestionTitle>

      <QuestionForm>
        <Box>
          {contextType === 'Date' && (
            <DatePicker
              selectedDate={getContextDate()}
              onChange={handleSelectDate}
            />
          )}

          {['Text', 'Number'].includes(contextType!) && (
            <Box>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                label={context.label}
                InputProps={{
                  inputProps: {
                    mask: getMask()
                  },
                  startAdornment:
                    context.format === 'Currency' ? (
                      <InputAdornment position="start">$</InputAdornment>
                    ) : null,
                  placeholder: context.properties?.placeholder ?? '',
                  inputComponent: MaskedInput,
                  value: inputValue,
                  onChange: handleChangeInputValue,
                  onKeyDown: handleKeyDown
                }}
              />
            </Box>
          )}

          <Box textAlign="right">
            {contextType !== 'Date' && (
              <Button
                variant="contained"
                color="secondary"
                disabled={!inputValue}
                className={classes.saveButton}
                onClick={() => handleSave()}
              >
                Save
              </Button>
            )}
          </Box>
        </Box>
      </QuestionForm>
    </QuestionSection>
  )
}
