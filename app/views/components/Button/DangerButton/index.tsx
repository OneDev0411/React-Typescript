import React from 'react'
import { Button, ButtonProps, Theme, ThemeProvider } from '@material-ui/core'
import { red } from '@material-ui/core/colors'

const dangerTheme = (outerTheme: Theme) => {
  return {
    ...outerTheme,
    palette: {
      ...outerTheme.palette,
      primary: {
        ...outerTheme.palette.primary,
        main: red['500'],
        light: red['400'],
        dark: red['900']
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
