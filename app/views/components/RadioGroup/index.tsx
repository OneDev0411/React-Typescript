import React, { useState, ReactNode } from 'react'
import {
  makeStyles,
  Theme,
  Box,
  Radio,
  Typography,
  useTheme
} from '@material-ui/core'

export interface RadioItem<T extends string = string> {
  value: Nullable<T>
  label: string
  description?: string
  children?: ReactNode
}

export interface RadioGroupProps<T extends string = string> {
  name: string
  defaultValue?: string | null
  value?: T | null
  options: (RadioItem<T> | false)[]
  style?: React.CSSProperties
  groupStyle?: React.CSSProperties
  onChange: (value: unknown) => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    group: {
      backgroundColor: theme.palette.grey['50'],
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(0.25, 0.75),
      marginBottom: theme.spacing(1),
      cursor: 'pointer'
    },
    content: {
      flexGrow: 1,
      paddingLeft: theme.spacing(2)
    },
    description: {
      color: theme.palette.grey['500']
    }
  }),
  {
    name: 'RadioGroup'
  }
)

export function RadioGroup<T extends string = string>({
  name,
  options,
  defaultValue,
  style = {},
  groupStyle = {},
  onChange,
  value: outValue
}: RadioGroupProps<T>) {
  const classes = useStyles()
  const theme = useTheme<Theme>()
  const [value, setValue] = useState(defaultValue)
  const finalValue = outValue !== undefined ? outValue : value

  const handleChange = (newValue: string | null) => {
    if (outValue === undefined) {
      setValue(newValue)
    }

    if (newValue !== finalValue) {
      onChange(newValue)
    }
  }

  return (
    <div style={style}>
      {options.map((item, index) => {
        if (!item) {
          return null
        }

        const isChecked = item.value === finalValue

        return (
          <div
            key={index}
            className={classes.group}
            style={{
              borderColor: isChecked
                ? theme.palette.primary.main
                : theme.palette.divider,
              background: isChecked
                ? theme.palette.success.ultralight
                : 'inherit',
              ...groupStyle
            }}
            onClick={() => handleChange(item.value)}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Radio
                  name={name}
                  value={item.value}
                  color={isChecked ? 'primary' : 'default'}
                  checked={isChecked}
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                className={classes.content}
                style={{
                  color: isChecked
                    ? theme.palette.primary.main
                    : theme.palette.common.black
                }}
              >
                <Typography variant="body1">{item.label}</Typography>
                <Typography variant="body2" className={classes.description}>
                  {item.description}
                </Typography>
              </Box>
            </Box>
            {item.children}
          </div>
        )
      })}
    </div>
  )
}
