import { useState } from 'react'

import {
  BaseTextFieldProps,
  IconButton,
  InputAdornment,
  TextField,
  Theme,
  useTheme
} from '@material-ui/core'
import { mdiEyeOffOutline, mdiEyeOutline } from '@mdi/js'

import { SvgIcon } from '../SvgIcons'

interface Props extends BaseTextFieldProps {
  defaultVisible?: boolean
}

export function PasswordTextField({ defaultVisible = false, ...props }: Props) {
  const [isVisible, setIsVisible] = useState(defaultVisible)
  const theme = useTheme<Theme>()

  return (
    <TextField
      {...props}
      type={isVisible ? 'text' : 'password'}
      InputProps={{
        autoComplete: 'new-password',
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={() => setIsVisible(state => !state)}
            >
              <SvgIcon
                path={isVisible ? mdiEyeOffOutline : mdiEyeOutline}
                color={theme.palette.grey[500]}
              />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )
}
