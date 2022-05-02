export function captionFieldValidator(value: string): Optional<string> {
  if (!value || value.length < 2200) {
    return
  }

  return 'The field exceeds 2200 characters'
}
