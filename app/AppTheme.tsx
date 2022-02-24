import { useMemo } from 'react'

import {
  ThemeProvider,
  StylesProvider,
  responsiveFontSizes
} from '@material-ui/core'
import { useSelector } from 'react-redux'
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'

import { useUnsafeActiveBrand } from './hooks/brand'
import { MaterialUiGlobalOverrides } from './material-ui-global-overrides'
import { IAppState } from './reducers'
import { themeGenerator } from './theme'
import { getBrandTheme } from './utils/get-brand-theme'

export const AppTheme = ({ children }) => {
  // Custom hostname brand
  const hostBrand: Nullable<IBrand> = useSelector(
    (state: IAppState) => state.brand
  )
  const activeBrand = useUnsafeActiveBrand()
  const brandTheme = getBrandTheme(activeBrand, hostBrand)
  const theme = useMemo(() => themeGenerator(brandTheme), [brandTheme])

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
