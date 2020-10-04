import React, { useMemo } from 'react'
import {
  Theme,
  ThemeOptions,
  ThemeProvider,
  StylesProvider,
  responsiveFontSizes
} from '@material-ui/core'
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'

import { useSelector } from 'react-redux'

import { getBrandTheme } from './utils/get-brand-theme'

import { IAppState } from './reducers'

import { themeGenerator } from './theme'
import { MaterialUiGlobalOverrides } from './material-ui-global-overrides'

export const AppTheme = ({ children }) => {
  const brand = useSelector<IAppState, IBrand>(
    (state: IAppState) => state.brand
  )
  const brandTheme: ThemeOptions = getBrandTheme(brand)
  const theme: Theme = useMemo(() => themeGenerator(brandTheme), [brandTheme])

  return (
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
}
