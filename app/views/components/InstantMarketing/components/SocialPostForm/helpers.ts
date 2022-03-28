import { requiredTextValidator } from '@app/utils/validations'

export function captionFieldValidator(value: string): Optional<string> {
  const requiredTextError = requiredTextValidator(value)

  if (requiredTextError) {
    return requiredTextError
  }

  if (value.length < 2200) {
    return
  }

  return 'The field exceeds 2200 characters'
}
