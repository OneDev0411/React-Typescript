export const requiredTextValidator = (value: string) =>
  !!value && value.trim() === '' ? 'This field is required' : undefined
