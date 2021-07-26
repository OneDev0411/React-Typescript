export const getBrandLogo = (
  brand: IBrand,
  defaultValue: string = '/static/images/logo.svg'
): string => {
  const logo = brand?.settings?.theme?.navbar_logo

  return logo || defaultValue
}
