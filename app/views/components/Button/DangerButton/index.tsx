import * as React from 'react'
import { Button, Theme } from '@material-ui/core'
import { ButtonProps } from '@material-ui/core/Button'
import { ThemeProvider } from '@material-ui/styles'
import { red } from '@material-ui/core/colors'

const dangerTheme = (outerTheme: Theme) => {
  return {
    ...outerTheme,
    palette: {
      ...outerTheme.palette,
      primary: {
        ...outerTheme.palette.primary,
        main: red['500']
        // Other keys also need values, but for button it's enough
      }
    }
  }
}

export const DangerButton = (props: Omit<ButtonProps, 'color'>) => (
  <ThemeProvider theme={dangerTheme}>
    <Button {...props} color="primary" />
  </ThemeProvider>
)
