declare type LogoType =
  | 'body-logo-wide'
  | 'body-logo-square'
  | 'container-logo-wide'
  | 'container-logo-square'
  | 'inverted-logo-wide'
  | 'inverted-logo-square'

export const getBrandLogo = (brand: IBrand, type: LogoType, defaultValue:string = '/static/images/logo.svg'): string => {
  if(!brand?.settings?.palette?.palette){
    return defaultValue
  }

  const palette: BrandSettingsPalette = brand.settings.palette.palette

  return palette[type] ?? defaultValue
}