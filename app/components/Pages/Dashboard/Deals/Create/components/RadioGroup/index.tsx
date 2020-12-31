import React, { useState } from 'react'
import {
  makeStyles,
  Theme,
  Box,
  Radio,
  Typography,
  useTheme
} from '@material-ui/core'

type RadioItem = {
  value: string
  label: string
  description?: string
}

interface Props {
  name: string
  defaultValue?: string
  options: RadioItem[]
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
      padding: theme.spacing(1),
      marginBottom: theme.spacing(2),
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
    name: 'CreateDeal-RadioGroup'
  }
)

export function RadioGroup({
  name,
  defaultValue,
  options,
  style = {},
  groupStyle = {},
  onChange
}: Props) {
  const classes = useStyles()
  const [value, setValue] = useState(defaultValue)
  const theme = useTheme<Theme>()

  const handleChange = (value: string) => {
    setValue(value)
    onChange(value)
  }

  return (
    <div style={style}>
      {options.map((item, index) => (
        <div
          key={index}
          className={classes.group}
          style={{
            ...groupStyle,
            background:
              value === item.value
                ? theme.palette.success.ultralight
                : 'inherit'
          }}
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
                checked={item.value === value}
                onClick={() => handleChange(item.value)}
              />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              className={classes.content}
              onClick={() => handleChange(item.value)}
            >
              <Typography variant="body1">{item.label}</Typography>
              <Typography variant="body1" className={classes.description}>
                {item.description}
              </Typography>
            </Box>
          </Box>
        </div>
      ))}
    </div>
  )
}
