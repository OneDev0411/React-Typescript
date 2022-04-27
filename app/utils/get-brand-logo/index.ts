import { getBrandTheme } from '@app/utils/get-brand-theme'

export const getBrandLogo = (
  brand: Nullable<IBrand>,
  hostBrand?: Nullable<IBrand>,
  defaultValue: string = '/static/images/logo.svg'
): string => {
  const theme = getBrandTheme(brand, hostBrand)

  return theme?.navbar?.logo?.url || defaultValue
}
