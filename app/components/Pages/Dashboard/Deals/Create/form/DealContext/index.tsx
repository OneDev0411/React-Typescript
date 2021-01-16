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

import { useWizardForm } from 'components/QuestionWizard/use-context'
import { getField } from 'models/Deal/helpers/context'

import { useFormContext } from '../../context/use-form-context'

interface Props {
  step?: number
  context: IDealBrandContext
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

export function DealContext({ step, context }: Props) {
  const wizard = useWizardForm()
  const classes = useStyles()
  const { deal } = useFormContext()
  const dispatch = useDispatch()

  const defaultValue = deal ? getField(deal, context.key) : ''

  const [inputValue, setInputValue] = useState(defaultValue)

  const contextType = context.data_type

  useEffect(() => {
    if (defaultValue && !inputValue) {
      setInputValue(defaultValue)
    }
    // eslint-disable-next-line
  }, [defaultValue])

  const handleSelectDate = (date: Date, type: 'day' | 'month' | 'year') => {
    if (type !== 'day') {
      return
    }

    const value = fecha.format(date, 'YYYY-MM-DD')

    setInputValue(value)
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
    try {
      const data = createUpsertObject(deal, context.key, value, false)

      if (!data) {
        throw new Error(`context ${context.key} is null`)
      }

      dispatch(upsertContexts(deal!.id, [data]))
    } catch (e) {
      console.log(e)
    }

    wizard.next()
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

  if (wizard.lastVisitedStep < step!) {
    return null
  }

  return (
    <QuestionSection step={step}>
      <QuestionTitle>
        {contextType === 'Date' ? 'When' : 'What'} is the{' '}
        <span className={classes.label}>{context.label}</span> for this deal?
      </QuestionTitle>

      <QuestionForm>
        <Box>
          {contextType === 'Date' && (
            <DatePicker
              selectedDate={
                defaultValue ? new Date(defaultValue * 1000) : new Date()
              }
              onChange={handleSelectDate}
            />
          )}

          {['Text', 'Number'].includes(contextType!) && (
            <Box>
              <TextField
                fullWidth
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
      </QuestionForm>
    </QuestionSection>
  )
}
