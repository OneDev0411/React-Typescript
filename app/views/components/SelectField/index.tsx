import React, { ChangeEvent, useState, ReactNode } from 'react'
import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  MenuItem,
  MenuItemProps,
  Select,
  SelectProps
} from '@material-ui/core'

export interface SelectItem<T extends MenuItemProps['value'] = string> {
  label: string
  value: T
}

export interface SelectFieldProps<T extends MenuItemProps['value'] = string>
  extends Pick<
      FormControlProps,
      'fullWidth' | 'size' | 'variant' | 'margin' | 'error'
    >,
    Pick<SelectProps, 'placeholder' | 'label' | 'displayEmpty'> {
  defaultValue?: T
  value?: T
  onChange?: (value: T) => void
  options: SelectItem<T>[]
  helperText?: ReactNode
}

function SelectField<T extends MenuItemProps['value'] = string>({
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
  error
}: SelectFieldProps<T>) {
  const [value, setValue] = useState<Optional<T>>(defaultValue)
  const finalValue = outValue !== undefined ? outValue : value

  const handleChange = (event: ChangeEvent<{ value: T }>) => {
    onChange?.(event.target.value)

    if (outValue === undefined) {
      setValue(value)
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
      <Select
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
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default SelectField
