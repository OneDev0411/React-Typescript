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
import { useDispatch, useSelector } from 'react-redux'

import { ACL } from '@app/constants/acl'
import { convertUnixtimeToUtc } from '@app/utils/convert-unixitme-to-utc'
import { useAcl } from '@app/views/components/Acl/use-acl'
import { upsertContexts } from 'actions/deals'
import DatePicker from 'components/DatePicker'
import { MaskedInput } from 'components/MaskedInput'
import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'
import { useSectionContext } from 'components/QuestionWizard/hooks/use-section-context'
import { useWizardContext } from 'components/QuestionWizard/hooks/use-wizard-context'
import { getContextInputMask } from 'deals/utils/get-context-mask'
import { createContextObject } from 'models/Deal/helpers/brand-context/create-context-object'
import { getContextProperties } from 'models/Deal/helpers/brand-context/get-context-properties'
import { getField } from 'models/Deal/helpers/context'
import { validateContext } from 'models/Deal/helpers/context/validate-context'
import { IAppState } from 'reducers'
import { getBrandChecklistsById } from 'reducers/deals/brand-checklists'
import { getDealChecklists } from 'reducers/deals/checklists'

import { useCreationContext } from '../../context/use-creation-context'

interface Props {
  concurrentMode?: boolean
  context: IDealBrandContext
  error?: string
  onChange?: (value: string | number) => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    label: {
      color: theme.palette.primary.main
    },
    datePickerContainer: {
      border: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(1),
      borderRadius: theme.shape.borderRadius
    },
    saveButton: {
      marginTop: theme.spacing(2)
    }
  }),
  {
    name: 'CreateDeal-Context'
  }
)

export function DealContext({
  concurrentMode = false,
  error,
  context,
  onChange
}: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { deal } = useCreationContext()
  const isBackOffice = useAcl(ACL.BACK_OFFICE)

  const { checklists, brandChecklists } = useSelector(
    ({ deals }: IAppState) => ({
      brandChecklists: deal
        ? getBrandChecklistsById(deals.brandChecklists, deal.brand.id)
        : [],
      checklists: getDealChecklists(deal, deals.checklists)
    })
  )

  const defaultValue = deal ? getField(deal, context.key) : ''

  const [inputValue, setInputValue] = useState(defaultValue)

  const contextType = context.data_type
  const properties = getContextProperties(context.key)
  const mask = getContextInputMask(context)

  useEffect(() => {
    if (defaultValue && !inputValue) {
      setInputValue(defaultValue)
    }
    // eslint-disable-next-line
  }, [defaultValue])

  useEffect(() => {
    if (
      inputValue &&
      concurrentMode &&
      validateContext(context, inputValue, true)
    ) {
      handleSave()
    }

    // eslint-disable-next-line
  }, [inputValue])

  const getContextDate = () => {
    if (!inputValue) {
      return undefined
    }

    return convertUnixtimeToUtc(inputValue)
  }

  const handleSelectDate = (date: Date, type: 'day' | 'month' | 'year') => {
    if (type !== 'day') {
      return
    }

    setInputValue(date.getTime() / 1000)
  }

  const handleChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!mask) {
      setInputValue(e.target.value)

      return
    }

    const maskedValue = e.target.value
    const value = maskedValue
      ? parseFloat(maskedValue.replace('$', '').replace(/\,/gi, ''))
      : ''

    setInputValue(value.toString())
  }

  const handleSave = () => {
    const value =
      contextType === 'Date'
        ? fecha.format(inputValue * 1000, 'YYYY-MM-DD')
        : inputValue

    if (deal && !onChange) {
      try {
        const approved = isBackOffice ? true : !context.needs_approval
        const data = createContextObject(
          deal,
          brandChecklists,
          checklists,
          context.key,
          value,
          approved
        )

        dispatch(upsertContexts(deal!.id, [data]))
      } catch (e) {
        console.log(e)
      }
    } else {
      onChange?.(value)
    }

    if (wizard.currentStep === step) {
      wizard.next()
    }
  }

  if (wizard.lastVisitedStep < step) {
    return null
  }

  return (
    <QuestionSection error={error}>
      <QuestionTitle>
        {contextType === 'Date' ? 'When' : 'What'} is the{' '}
        <span className={classes.label}>{context.label}</span> for this deal?
      </QuestionTitle>

      <QuestionForm>
        <Box mb={4}>
          {contextType === 'Date' && (
            <Box className={classes.datePickerContainer}>
              <DatePicker
                selectedDate={getContextDate()}
                onChange={handleSelectDate}
              />
            </Box>
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
                    mask
                  },
                  startAdornment:
                    context.format === 'Currency' ? (
                      <InputAdornment position="start">$</InputAdornment>
                    ) : null,
                  placeholder: properties?.placeholder ?? '',
                  inputComponent: mask ? MaskedInput : undefined,
                  value: inputValue,
                  onChange: handleChangeInputValue
                }}
              />
            </Box>
          )}

          {!concurrentMode && (
            <Box textAlign="right">
              <Button
                variant="contained"
                color="secondary"
                disabled={
                  !inputValue || !validateContext(context, inputValue, true)
                }
                className={classes.saveButton}
                onClick={() => handleSave()}
              >
                {defaultValue && defaultValue === inputValue
                  ? 'Looks Good'
                  : 'Save'}
              </Button>
            </Box>
          )}
        </Box>
      </QuestionForm>
    </QuestionSection>
  )
}
