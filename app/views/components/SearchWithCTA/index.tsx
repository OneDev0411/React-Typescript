import React, { useState, useEffect } from 'react'

import { TextField, CircularProgress, List, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import useAutocomplete from '@material-ui/lab/useAutocomplete'

const useStyles = makeStyles(
  theme => ({
    input: {
      backgroundColor: theme.palette.grey[100],
      border: 'none',
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.action.active,
      height: theme.spacing(5.25),
      lineHeight: 'initial',
      padding: theme.spacing(0, 1.5)
    },
    listboxContainer: {
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1,
      position: 'absolute',
      borderRadius: 4,
      overflow: 'hidden',
      boxShadow: '1px 1px 5px 1px rgba(0,0,0,0.22)',
      fontFamily: 'Lato'
    },
    listBoxFooter: {
      borderTop: '1px solid #e4e4e4',
      backgroundColor: '#F9FAFC',
      padding: 10,
      textTransform: 'none',
      textAlign: 'left'
    },
    listBoxFooterLabel: {
      justifyContent: 'start',
      color: '#00B286'
    },
    listbox: {
      padding: 0,
      margin: 0,
      listStyle: 'none',
      backgroundColor: theme.palette.background.paper,
      overflow: 'auto',
      maxHeight: 270,
      '& li': {
        padding: 8
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
    noResults: {
      padding: 8
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
}

export default function AutoComplete<T>({
  fullWidth = false,
  placeholder,
  renderOption,
  renderFooter,
  onFooterClick,
  getOptionLabel,
  model,
  debug = false,
  minChars = 2
}: Props<T>) {
  const classes = useStyles()

  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const widthStyle = { width: fullWidth ? '100%' : '500px' } // default width

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
    options,
    getOptionLabel,
    autoHighlight: true,
    open,
    debug,
    onOpen: () => {
      setOpen(true)
    },
    onClose: () => {
      setOpen(false)
      setOptions([])
    }
  })

  useEffect(() => {
    const fetchResults = async (value: string) => {
      let response

      setOpen(true)
      setIsLoading(true)

      // Either model is an object or a promise which gets us the
      // results with an ajax call
      if (typeof model === 'function') {
        response = await model(value)
      } else {
        response = model
      }

      setIsLoading(false)
      setOptions(response)
    }

    if (inputValue && inputValue.length >= minChars) {
      fetchResults(inputValue)
    }
  }, [inputValue, model, minChars])

  useEffect(() => {
    if (!open) {
      setOptions([])
    }
  }, [open])

  return (
    <div>
      <div {...getRootProps()}>
        <TextField
          placeholder={placeholder}
          variant="outlined"
          InputProps={{
            ...getInputProps(),
            className: classes.input,
            startAdornment: <SearchIcon />,
            endAdornment: (
              <>{isLoading && <CircularProgress color="inherit" size={20} />}</>
            )
          }}
          style={widthStyle}
        />
      </div>
      {open && !isLoading && (
        <div className={classes.listboxContainer} style={widthStyle}>
          {options.length > 0 && inputValue.length > 0 && (
            <List className={classes.listbox} {...getListboxProps()}>
              {renderOption(
                groupedOptions,
                getOptionProps,
                getHighlightedText,
                { inputValue }
              )}
            </List>
          )}
          {groupedOptions.length === 0 &&
            inputValue.length > 0 &&
            !isLoading && (
              <div className={classes.noResults}>No results found.</div>
            )}
          {inputValue.length > 0 && (
            <Button
              className={classes.listBoxFooter}
              classes={{ label: classes.listBoxFooterLabel }}
              onClick={() => onFooterClick(inputValue)}
            >
              {renderFooter(inputValue)}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
