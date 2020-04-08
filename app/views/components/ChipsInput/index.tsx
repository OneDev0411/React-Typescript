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
  Tooltip,
  useTheme
} from '@material-ui/core'
import classNames from 'classnames'
import Downshift from 'downshift'
import PopperJs from 'popper.js'
import useObservable from 'react-use/lib/useObservable'
import { of } from 'rxjs/observable/of'
import { useDebounce } from 'use-debounce'

import { isPromise } from 'rxjs/util/isPromise'

import { fromPromise } from 'rxjs/observable/fromPromise'

import { ClassesProps } from 'utils/ts-utils'

import { ChipsInputProps } from './types'
import Avatar from '../Avatar'
import { InputWithStartAdornment } from './InputWithStartAdornment'
import { useChipStyles } from '../../../styles/use-chips-styles'

const styles = (theme: Theme) =>
  createStyles({
    chip: {
      margin: theme.spacing(0.75, 0.25)
    },
    inputRoot: {
      // `alignItems: baseline` works fine in Chrome but not in safari. When
      // the input is empty, label is not aligned well. See #3436
      alignItems: 'start',
      '& .MuiFormLabel-root': {
        marginTop: `${theme.spacing(1)}px`
      }
    },
    inputInput: {
      width: 'auto',
      flexGrow: 1,
      paddingBottom: `${theme.spacing(1.1)}px`
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
const useStyles = makeStyles(styles)
const emptySuggestion$ = of([])

/**
 * NOTE: At the moment that this component is written, MUI doesn't support
 * any high level component for this purpose. But it seems [it will be added
 * in future](https://github.com/mui-org/material-ui/issues/13863).
 * We can consider replacing this with that when it's out.
 */
export function ChipsInput<T>({
  TextFieldComponent = TextField,
  TextFieldProps = {},
  ChipProps = {},
  items,
  onChange = () => {},
  createFromString = () => undefined,
  allowAddOnEnter = true,
  allowAddOnComma = true,
  allowAddOnBlur = true,
  readOnly = false,
  itemToChip,
  itemToSuggestion,
  searchDebounce = 500,
  getSuggestions = () => emptySuggestion$,
  ...props
}: ChipsInputProps<T> & ClassesProps<typeof styles>) {
  const classes = useStyles(props)
  const chipClasses = useChipStyles()

  const theme = useTheme()

  const inputRef = useRef<HTMLInputElement>(null)
  const popperRef = useRef<PopperJs>(null)

  const [inputValue, setInputValue] = React.useState('')

  const deleteChipAtIndex = index => {
    const result = [...items]

    result.splice(index, 1)

    onChange(result)
  }

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
    if (
      items.length &&
      !inputValue.length &&
      event.key === 'Backspace' &&
      !readOnly
    ) {
      deleteChipAtIndex(items.length - 1)
    }

    if (
      inputValue &&
      ((event.key === 'Enter' && allowAddOnEnter) ||
        (event.key === ',' && allowAddOnComma)) &&
      highlightedIndexRef.current === null
    ) {
      createFromStringAndClearInput()
      event.preventDefault()
    }
  }
  const handleBlur = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (TextFieldProps.inputProps && TextFieldProps.inputProps.onBlur) {
      TextFieldProps.inputProps.onBlur(event)
    }

    if (inputValue && allowAddOnBlur) {
      createFromStringAndClearInput()
    }
  }

  const chips = items.map((item, index) => {
    const chipData = itemToChip(item)

    const chip = (
      <Chip
        key={`${index}-${chipData.label}`}
        className={classNames(classes.chip, ChipProps.className, {
          [chipClasses.error]: chipData.hasError
        })}
        size="small"
        {...ChipProps}
        label={chipData.label}
        onDelete={readOnly ? undefined : () => deleteChipAtIndex(index)}
      />
    )

    return chipData.tooltip ? (
      <Tooltip title={chipData.tooltip}>{chip}</Tooltip>
    ) : (
      chip
    )
  })

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        const suggestions = getSuggestions(debouncedInputValue)

        return isPromise<T[]>(suggestions)
          ? fromPromise(suggestions)
          : suggestions
      }, [getSuggestions, debouncedInputValue])
    ) || []

  function createFromStringAndClearInput() {
    const newItem = createFromString(inputValue)

    if (newItem != undefined) {
      onChange([...items, newItem])
      setInputValue('')
    }
  }

  const renderAvatar = suggestion => {
    const { defaultAvatarProps, avatar } = suggestion

    if (avatar) {
      return <ListItemAvatar>{avatar}</ListItemAvatar>
    }

    if (defaultAvatarProps) {
      return (
        <ListItemAvatar>
          <Avatar {...defaultAvatarProps} />
        </ListItemAvatar>
      )
    }

    return null
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

        const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
          ...(TextFieldProps.inputProps || {}),
          onKeyDown,
          onBlur: handleBlur,
          onChange: onInputChange
        })

        return (
          <div className={classes.container}>
            <TextFieldComponent
              color="secondary"
              inputRef={inputRef}
              fullWidth
              {...TextFieldProps}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              InputProps={{
                ...(TextFieldProps.InputProps || {}),
                onBlur,
                onChange,
                onFocus,
                inputComponent: InputWithStartAdornment,
                inputProps: {
                  ...inputProps,
                  adornment: chips,
                  autoComplete: 'off'
                },
                readOnly,
                classes: {
                  root: classes.inputRoot,
                  input: classes.inputInput
                }
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

                  if (!suggestion) {
                    return null
                  }

                  return (
                    <ListItem
                      dense
                      {...getItemProps({ item: suggestedItem })}
                      key={`${index}-${suggestion.title}`}
                      selected={highlightedIndex === index}
                      button
                    >
                      {renderAvatar(suggestion)}
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
