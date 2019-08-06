import * as React from 'react'
import { useEffect, useMemo, useRef } from 'react'
import {
  Chip,
  createStyles,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Paper,
  Popper,
  TextField,
  Theme,
  useTheme
} from '@material-ui/core'
import classNames from 'classnames'
import Downshift from 'downshift'
import PopperJs from 'popper.js'
import useObservable from 'react-use/lib/useObservable'
import { of } from 'rxjs/observable/of'
import { useDebounce } from 'use-debounce'

import { InputProps } from '@material-ui/core/Input'

import { ChipsInputProps } from './types'
import Avatar from '../Avatar'
import { InputWithStartAdornment } from './InputWithStartAdornment'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chip: {
      margin: theme.spacing(0.5, 0.25)
    },
    inputRoot: {
      alignItems: 'baseline'
    },
    inputInput: {
      width: 'auto',
      flexGrow: 1
    },
    suggestionList: {
      minWidth: '20rem',
      maxHeight: 'calc(50vh - 50px)',
      overflow: 'auto'
    },
    container: {
      display: 'flex',
      alignItems: 'flex-start'
    }
  })
)
const emptySuggestion$ = of([])

/**
 * NOTE: At the moment that this component is written, MUI doesn't support
 * any high level component for this purpose. But it seems [it will be added
 * in future](https://github.com/mui-org/material-ui/issues/13863).
 * We can consider replacing this with that when it's out.
 */
export function ChipsInput<T>({
  TextFieldProps = {},
  ChipProps = {},
  items,
  onChange = () => {},
  createFromString = () => undefined,
  allowAddOnEnter = true,
  allowAddOnBlur = true,
  readOnly = false,
  itemToChip,
  itemToSuggestion,
  searchDebounce = 500,
  getSuggestions = () => emptySuggestion$
}: ChipsInputProps<T>) {
  const classes = useStyles()

  const theme = useTheme()

  const inputRef = useRef<HTMLInputElement>(null)
  const popperRef = useRef<PopperJs>(null)

  const [inputValue, setInputValue] = React.useState('')

  const deleteChip = (item: T) =>
    onChange(items.filter(anItem => anItem !== item))

  const selectSuggestedItem = (suggestedItem: T) => {
    onChange([...items, suggestedItem])
    setInputValue('')
  }

  /**
   * We keep track of selected suggestion from downshift with a ref.
   * It could be much easier if hook version of downshift was available
   */
  const highlightedIndexRef = useRef<number | null>(null)

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (items.length && !inputValue.length && event.key === 'Backspace') {
      deleteChip(items[items.length - 1])
    }

    if (
      inputValue &&
      event.key === 'Enter' &&
      allowAddOnEnter &&
      highlightedIndexRef.current === null
    ) {
      createFromStringAndClearInput()
    }
  }
  const onBlur = () => {
    if (inputValue && allowAddOnBlur) {
      createFromStringAndClearInput()
    }
  }

  const renderedChips = items.map((item, index) => {
    const chip = itemToChip(item)

    return (
      <Chip
        key={`${index}-${chip.text}`}
        className={classNames(classes.chip, ChipProps.className)}
        size="small"
        {...ChipProps}
        label={chip.text}
        onDelete={readOnly ? undefined : () => deleteChip(item)}
      />
    )
  })

  const onInputChange = (event: React.ChangeEvent<{ value: string }>) => {
    setInputValue(event.target.value)
  }

  useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update()
    }
  }, [items])

  // NOTE: useObservable from react-use doesn't support loading and error
  // we can simply create our own version that support it, if needed.
  const [debouncedInputValue] = useDebounce(inputValue, searchDebounce)

  const suggestedItems =
    useObservable(
      useMemo(() => {
        return getSuggestions(debouncedInputValue)
      }, [getSuggestions, debouncedInputValue])
    ) || []

  const TextFieldInputProps: InputProps = {
    ...(TextFieldProps.InputProps || {}),
    readOnly,
    onKeyDown,
    onBlur,
    onChange: onInputChange
  }

  function createFromStringAndClearInput() {
    const newItem = createFromString(inputValue)

    if (newItem != undefined) {
      onChange([...items, newItem])
      setInputValue('')
    }
  }

  return (
    <Downshift
      inputValue={inputValue}
      onChange={selectSuggestedItem}
      selectedItem={items}
      itemCount={suggestedItems.length}
      // to prevent console warns
      itemToString={() => ''}
      defaultHighlightedIndex={0}
    >
      {({ getInputProps, getItemProps, highlightedIndex, isOpen }) => {
        highlightedIndexRef.current =
          suggestedItems.length > 0 && isOpen ? highlightedIndex : null

        return (
          <div className={classes.container}>
            {/*
            {label && (
              <FormLabel className={classes.label} {...getLabelProps()}>
                {label}
              </FormLabel>
            )}
*/}
            <TextField
              inputRef={inputRef}
              fullWidth
              {...TextFieldProps}
              InputProps={{
                ...getInputProps(TextFieldInputProps as any),
                inputComponent: InputWithStartAdornment,
                inputProps: {
                  ...(TextFieldInputProps.inputProps || {}),
                  adornment: renderedChips
                },
                classes: {
                  root: classes.inputRoot,
                  input: classes.inputInput
                },
                // interestingly, other values don't work and off works here!
                autoComplete: 'off'
              }}
            />
            <Popper
              open={isOpen}
              anchorEl={inputRef.current}
              popperRef={popperRef}
              placement="bottom-start"
              style={{ zIndex: theme.zIndex.modal }}
            >
              <Paper square className={classes.suggestionList}>
                {suggestedItems.map((suggestedItem, index) => {
                  const suggestion = itemToSuggestion(suggestedItem)

                  if (suggestion.avatar) {
                    console.log('suggestion.avatar', suggestion.avatar)
                  }

                  return (
                    <ListItem
                      dense
                      {...getItemProps({ item: suggestedItem })}
                      key={`${index}-${suggestion.title}`}
                      selected={highlightedIndex === index}
                      button
                    >
                      {suggestion.avatar &&
                      typeof suggestion.avatar === 'string' ? (
                        <ListItemAvatar>
                          <Avatar
                            title={suggestion.subtitle}
                            image={suggestion.avatar}
                          />
                        </ListItemAvatar>
                      ) : (
                        <ListItemAvatar>{suggestion.avatar}</ListItemAvatar>
                      )}
                      <ListItemText
                        primary={suggestion.title}
                        secondary={suggestion.subtitle}
                      />
                    </ListItem>
                  )
                })}
              </Paper>
            </Popper>
          </div>
        )
      }}
    </Downshift>
  )
}
