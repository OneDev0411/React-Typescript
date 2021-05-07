export const splitFullName = (fullName: string) => {
  const parts = fullName.split(' ')

  return {
    first_name: parts[0],
    last_name: parts[1]
  }
}

export const requiredTextValidator = (value: string) =>
  value.trim() === '' ? 'This field is required' : undefined
