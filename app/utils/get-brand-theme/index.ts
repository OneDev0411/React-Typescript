import {  ThemeOptions } from '@material-ui/core'
import flattenBrand from 'utils/flatten-brand'


export const getBrandTheme = (brand: IBrand): ThemeOptions => {
  if(!brand?.settings?.theme){
    return {}
  }

  return brand.settings.theme
}
