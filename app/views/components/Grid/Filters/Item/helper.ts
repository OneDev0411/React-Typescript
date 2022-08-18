export const getCurrentValues = (
  isActive: boolean,
  values: ILabelValue[]
): string | boolean => {
  if (!isActive && (!values || values.length === 0)) {
    return 'Missing value'
  }

  return Array.isArray(values) && values.map(item => item.label).join(' OR ')
}
