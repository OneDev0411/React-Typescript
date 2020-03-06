import React from 'react'
import {
  TextField,
  InputAdornment,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'
import { TextFieldProps } from '@material-ui/core/TextField'

import IconSearch from 'components/SvgIcons/Search/IconSearch'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      width: '400px',
      height: theme.spacing(5.5),
      border: 'none',
      backgroundColor: theme.palette.grey[50],
      padding: theme.spacing(0, 2),
      borderRadius: theme.shape.borderRadius,
      '&&&:before': {
        borderBottom: 'none'
      },
      '&&:after': {
        borderBottom: 'none'
      }
    },
    icon: {
      fill: theme.palette.grey[500]
    }
  })
)

export function SearchInput(props: TextFieldProps) {
  const classes = useStyles()

  return (
    <TextField
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconSearch className={classes.icon} />
          </InputAdornment>
        ),
        className: classes.input
      }}
      {...props}
    />
  )
}
