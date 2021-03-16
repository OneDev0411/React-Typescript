declare type LogoType =
  | 'body-logo-wide'
  | 'body-logo-square'
  | 'container-logo-wide'
  | 'container-logo-square'
  | 'inverted-logo-wide'
  | 'inverted-logo-square'

export const getBrandLogo = (brand: IBrand, defaultValue:string = '/static/images/logo.svg'): string => {
  const logo = brand?.settings?.theme?.navbar_logo
  return logo ? logo : defaultValue
}
