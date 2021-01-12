import React, { useState } from 'react'
import {
  Button,
  Box,
  makeStyles,
  TextField,
  InputAdornment,
  Theme
} from '@material-ui/core'

import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import DatePicker from 'components/DatePicker'
import { MaskedInput } from 'components/MaskedInput'

import { useWizardForm } from 'components/QuestionWizard/use-context'

interface Props {
  step?: number
  context: IDealBrandContext
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    label: {
      color: theme.palette.primary.main
    },
    continueButton: {
      marginTop: theme.spacing(2)
    },
    datePicker: {
      padding: theme.spacing(2, 0),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius
    }
  }),
  {
    name: 'CreateDeal-Context'
  }
)

export function DealContext({ step, context }: Props) {
  const wizard = useWizardForm()
  const classes = useStyles()
  const [inputValue, setInputValue] = useState('')

  const contextType = context.data_type

  const handleSelectDate = (date: Date, type: 'day' | 'month' | 'year') => {
    if (type !== 'day') {
      return
    }

    wizard.next()
  }

  const handleChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = e.target.value
    const value = maskedValue
      ? parseFloat(maskedValue.replace('$', '').replace(/\,/gi, ''))
      : ''

    setInputValue(value.toString())
  }

  const handleContinue = () => {
    wizard.next()
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

  return (
    <QuestionSection step={step}>
      <QuestionTitle>
        {contextType === 'Date' ? 'When' : 'What'} is the{' '}
        <span className={classes.label}>{context.label}</span> for this deal?
      </QuestionTitle>

      <QuestionForm>
        <Box>
          {contextType === 'Date' && (
            <Box className={classes.datePicker}>
              <DatePicker onChange={handleSelectDate} />
            </Box>
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
                  onChange: handleChangeInputValue
                }}
              />
            </Box>
          )}

          {contextType !== 'Date' && (
            <Button
              variant="contained"
              color="secondary"
              disabled={!inputValue}
              className={classes.continueButton}
              onClick={handleContinue}
            >
              Continue
            </Button>
          )}
        </Box>
      </QuestionForm>
    </QuestionSection>
  )
}
