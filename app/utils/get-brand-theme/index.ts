import {  ThemeOptions } from '@material-ui/core'
import flattenBrand from 'utils/flatten-brand'


export const getBrandTheme = (brand: IBrand): ThemeOptions => {
  if(!brand?.settings?.palette?.palette){
    return {}
  }
  const palette: BrandSettingsPalette = brand.settings.palette.palette

  // TODO: create a mapper instead of hard coding the the key
  return {
    palette: {
      primary: {
      main: palette["inverted-container-bg-color"],
      light: palette["inverted-container-bg-color"],
      dark: palette["inverted-container-bg-color"],
      contrastText: palette["inverted-container-text-color"]
    }
    }
  }
}