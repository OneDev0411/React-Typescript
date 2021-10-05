import React, { useState } from 'react'

import { Button, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import useAutocomplete from '@material-ui/lab/useAutocomplete'
import { useDebouncedCallback } from 'use-debounce'

import { SearchInput } from '@app/views/components/SearchInput'

const useStyles = makeStyles(
  theme => ({
    listboxContainer: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      borderRadius: theme.shape.borderRadius,
      boxShadow: '1px 1px 5px 1px rgba(0,0,0,0.22)',
      zIndex: 1
    },
    listbox: {
      backgroundColor: theme.palette.background.paper,
      maxHeight: 270,
      // For the sake of consistency someone would use
      // ul li as for the list in the future
      '& ul': {
        padding: 0,
        margin: 0,
        listStyle: 'none'
      },
      '& li': {
        padding: theme.spacing(1)
      },
      '& li[data-focus="true"]': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        color: '#000',
        cursor: 'pointer'
      },
      '& li:active': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        color: '#000'
      }
    },
    listBoxFooter: {
      borderTop: '1px solid #e4e4e4',
      backgroundColor: '#F9FAFC',
      padding: theme.spacing(1),
      textTransform: 'none',
      textAlign: 'left'
    },
    listBoxFooterButton: {
      '&:hover': {
        backgroundColor: theme.palette.grey[100]
      }
    },
    listBoxFooterLabel: {
      justifyContent: 'start',
      color: theme.palette.primary.main
    },
    noResults: {
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.paper
    }
  }),
  { name: 'AutoComplete' }
)

function getHighlightedText(text: string, highlight: string) {
  // Split on highlight term and include term into parts, ignore case
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'))

  return (
    <span>
      {' '}
      {parts.map((part, i) => (
        <span
          key={i}
          style={
            part.toLowerCase() === highlight.toLowerCase()
              ? { fontWeight: 'bold' }
              : {}
          }
        >
          {part}
        </span>
      ))}{' '}
    </span>
  )
}

interface Props<T> {
  fullWidth?: boolean
  placeholder: string
  renderOption: (
    options: T[],
    getOptionProps: ({ option, index }: { option: T; index: number }) => {},
    getHighlightedText: (text: string, highlight: string) => React.ReactNode,
    state: { inputValue: string }
  ) => React.ReactNode
  renderFooter: (inputValue: string) => React.ReactNode
  getOptionLabel: (option: T) => string
  onFooterClick: (value: string) => void
  model: T[] | ((value: string) => Promise<T[]>)
  debug?: boolean
  minChars?: number
  debounce?: number
  disableClearButton?: boolean
  clearOnBlur?: boolean
}

export default function AutoComplete<T>({
  fullWidth = false,
  placeholder,
  renderOption,
  renderFooter,
  onFooterClick,
  getOptionLabel,
  debug = false,
  model,
  minChars = 2,
  debounce = 200,
  disableClearButton,
  clearOnBlur = false
}: Props<T>) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [controlledInputValue, setControlledInputValue] = React.useState('')

  const widthStyle = { width: fullWidth ? '100%' : '360px' } // default width

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    inputValue
  } = useAutocomplete<T>({
    id: 'auto-complete',
    autoComplete: true,
    autoHighlight: true,
    options,
    inputValue: controlledInputValue,
    getOptionLabel,
    clearOnBlur,
    open,
    debug,
    onOpen: () => {
      setOpen(true)
    },
    onClose: (e, reason) => {
      // @ts-ignore
      const targetEl = e.relatedTarget

      if (targetEl) {
        if (
          targetEl.className.includes('listBoxFooter') &&
          typeof onFooterClick === 'function'
        ) {
          onFooterClick(inputValue)
        }
      }

      setOpen(false)
    },
    onInputChange: (e, value, reason) => {
      // console.log('onInputChange', e, value, reason);
      setControlledInputValue(value)
    }
    // onChange: (event, value, reason, details) => {
    //   console.log('onChange', event, value, reason, details)
    // }
  })

  const [fetchResults] = useDebouncedCallback(async (value: string) => {
    let response

    // Either model is an object or a promise which gets us the
    // results with an ajax call
    if (typeof model === 'function') {
      response = await model(value)
    } else {
      response = model
    }

    setOptions(response)
    setIsLoading(false)
    setOpen(true)
  }, debounce)

  return (
    <div>
      <div {...getRootProps()}>
        <SearchInput
          value={inputValue}
          placeholder={placeholder}
          inputProps={{ ...getInputProps() }}
          isLoading={isLoading}
          disableClearButton={disableClearButton}
          onClearHandler={() => {
            setControlledInputValue('')
          }}
          onChangeHandler={(e, value = '') => {
            setIsLoading(true)

            if (value && value.length >= minChars) {
              fetchResults(value)
            } else {
              setIsLoading(false)
            }
          }}
        />
      </div>
      {open && inputValue.length >= minChars && (
        <div className={classes.listboxContainer} style={widthStyle}>
          {options.length > 0 && inputValue.length > 0 && (
            <Box className={classes.listbox} {...getListboxProps()}>
              {renderOption(
                groupedOptions,
                getOptionProps,
                getHighlightedText,
                { inputValue }
              )}
            </Box>
          )}
          {groupedOptions.length === 0 &&
            inputValue.length > 0 &&
            !isLoading && (
              <div className={classes.noResults}>No results found.</div>
            )}
          {inputValue.length > 0 && (
            <Button
              className={classes.listBoxFooter}
              classes={{
                root: classes.listBoxFooterButton,
                label: classes.listBoxFooterLabel
              }}
            >
              {renderFooter(inputValue)}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
