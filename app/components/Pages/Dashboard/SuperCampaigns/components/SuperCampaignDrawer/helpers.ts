export function requiredTextValidator(value: string): Optional<string> {
  return !value || value.trim() === '' ? 'This field is required' : undefined
}
