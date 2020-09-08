import React from 'react'
import {
  StylesProvider,
  ThemeProvider,
  responsiveFontSizes
} from '@material-ui/core'
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'

import { theme } from './theme'
import { MaterialUiGlobalOverrides } from './material-ui-global-overrides'

export const AppTheme = ({ children }) => (
  <>
    {/* Enable overriding styles with styled(SomeCmp)`...`. See https://material-ui.com/guides/interoperability#controlling-priority */}
    <StylesProvider injectFirst>
      {/* Provide theme for material-ui built-in components like buttons */}
      <ThemeProvider theme={theme}>
        {/* Provide theme to be used for our own styled components */}
        <StyledComponentsThemeProvider theme={responsiveFontSizes(theme)}>
          <>{children}</>
        </StyledComponentsThemeProvider>
      </ThemeProvider>
    </StylesProvider>
    <MaterialUiGlobalOverrides />
  </>
)
