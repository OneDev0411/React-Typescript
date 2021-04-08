import React, { ChangeEvent, useState, ReactNode } from 'react'
import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  MenuItem,
  MenuItemProps,
  Select as MSelect,
  SelectProps as MSelectProps
} from '@material-ui/core'

export type SelectValue = MenuItemProps['value']

export interface SelectItem<T extends SelectValue = string> {
  label: string
  value: T
}

export interface SelectProps<T extends SelectValue = string>
  extends Pick<
      FormControlProps,
      'fullWidth' | 'size' | 'variant' | 'margin' | 'error'
    >,
    Pick<
      MSelectProps,
      'placeholder' | 'label' | 'displayEmpty' | 'inputProps'
    > {
  defaultValue?: T
  value?: T
  onChange?: (value: T) => void
  options: (SelectItem<T> | false)[]
  helperText?: ReactNode
}

function Select<T extends SelectValue = string>({
  variant = 'outlined',
  size = 'small',
  fullWidth = true,
  placeholder = '',
  displayEmpty = !!placeholder,
  label,
  defaultValue,
  value: outValue,
  onChange,
  options,
  margin,
  helperText,
  error,
  ...otherProps
}: SelectProps<T>) {
  const [value, setValue] = useState<Optional<T>>(defaultValue)
  const finalValue = outValue !== undefined ? outValue : value

  const handleChange = (event: ChangeEvent<{ value: T }>) => {
    onChange?.(event.target.value)

    if (outValue === undefined) {
      setValue(event.target.value)
    }
  }

  return (
    <FormControl
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      margin={margin}
      error={error}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <MSelect
        {...otherProps}
        value={displayEmpty ? finalValue || '' : finalValue}
        onChange={handleChange}
        displayEmpty={displayEmpty}
        label={label}
      >
        {displayEmpty && (
          <MenuItem value="" hidden={!placeholder}>
            {placeholder}
          </MenuItem>
        )}
        {options.map(
          (option, index) =>
            option && (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            )
        )}
      </MSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default Select
